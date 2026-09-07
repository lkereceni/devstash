import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const PASSWORD_ROUNDS = 12;

// Must match the prefix forgot-password/route.ts writes — see that file for
// why password-reset tokens are namespaced within VerificationToken.
const PASSWORD_RESET_IDENTIFIER_PREFIX = "password-reset:";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { token, password } = parsed.data;

  const resetToken = await prisma.verificationToken.findFirst({ where: { token } });

  if (!resetToken || !resetToken.identifier.startsWith(PASSWORD_RESET_IDENTIFIER_PREFIX)) {
    return NextResponse.json(
      { success: false, error: "That reset link is invalid." },
      { status: 400 },
    );
  }

  // Delete before checking expiry, same as verify-email/route.ts, so a
  // replayed link always reads as invalid rather than re-consuming.
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: resetToken.identifier,
        token: resetToken.token,
      },
    },
  });

  if (resetToken.expires < new Date()) {
    return NextResponse.json(
      { success: false, error: "That reset link has expired." },
      { status: 400 },
    );
  }

  const email = resetToken.identifier.slice(PASSWORD_RESET_IDENTIFIER_PREFIX.length);
  const hashedPassword = await bcrypt.hash(password, PASSWORD_ROUNDS);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
