import { randomBytes } from "crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/password-reset-email";

const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

// Namespaces password-reset tokens within the shared VerificationToken table
// so they can't collide with email-verification tokens for the same
// identifier (email) — each flow only ever deletes/looks up its own prefix.
const PASSWORD_RESET_IDENTIFIER_PREFIX = "password-reset:";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  // Always respond with the same success shape whether or not an account
  // exists, so this endpoint can't be used to probe for registered emails.
  const genericResponse = NextResponse.json({ success: true }, { status: 200 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return genericResponse;
  }

  const identifier = `${PASSWORD_RESET_IDENTIFIER_PREFIX}${email}`;
  await prisma.verificationToken.deleteMany({ where: { identifier } });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires: new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS),
    },
  });

  const resetUrl = new URL("/reset-password", request.url);
  resetUrl.searchParams.set("token", token);

  try {
    await sendPasswordResetEmail(email, resetUrl.toString());
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }

  return genericResponse;
}
