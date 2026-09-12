import { randomBytes } from "crypto";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { isEmailVerificationEnabled, sendVerificationEmail } from "@/lib/verification-email";
import { checkRateLimit, getClientIp, rateLimitExceededResponse, rateLimiters } from "@/lib/rate-limit";

const PASSWORD_ROUNDS = 12;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const registerSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  const rateLimitResult = await checkRateLimit(rateLimiters.register, getClientIp(request));
  if (!rateLimitResult.success) return rateLimitExceededResponse(rateLimitResult);

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { success: false, error: "A user with this email already exists" },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, PASSWORD_ROUNDS);
  const requireVerification = isEmailVerificationEnabled();
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      ...(requireVerification ? {} : { emailVerified: new Date() }),
    },
  });

  if (requireVerification) {
    const token = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
      },
    });

    const verifyUrl = new URL("/api/auth/verify-email", request.url);
    verifyUrl.searchParams.set("token", token);

    try {
      await sendVerificationEmail(user.email, verifyUrl.toString());
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  }

  return NextResponse.json(
    { success: true, data: { id: user.id, name: user.name, email: user.email } },
    { status: 201 },
  );
}
