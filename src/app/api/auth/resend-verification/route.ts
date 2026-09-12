import { randomBytes } from "crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { isEmailVerificationEnabled, sendVerificationEmail } from "@/lib/verification-email";
import { checkRateLimit, getClientIp, rateLimitExceededResponse, rateLimiters } from "@/lib/rate-limit";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const resendSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = resendSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  const rateLimitResult = await checkRateLimit(
    rateLimiters.resendVerification,
    `${getClientIp(request)}:${email}`,
  );
  if (!rateLimitResult.success) return rateLimitExceededResponse(rateLimitResult);

  // Always respond with the same success shape whether or not an account
  // exists or is already verified, so this endpoint can't be used to probe
  // for registered emails.
  const genericResponse = NextResponse.json({ success: true }, { status: 200 });

  if (!isEmailVerificationEnabled()) {
    return genericResponse;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) {
    return genericResponse;
  }

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
    },
  });

  const verifyUrl = new URL("/api/auth/verify-email", request.url);
  verifyUrl.searchParams.set("token", token);

  try {
    await sendVerificationEmail(email, verifyUrl.toString());
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  return genericResponse;
}
