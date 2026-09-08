import "server-only";

import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { User, UserProfile } from "@/features/user/types";

const PASSWORD_ROUNDS = 12;

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, isPro: true },
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.image,
    isPro: user.isPro,
  };
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isPro: true,
      createdAt: true,
      password: true,
    },
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.image,
    isPro: user.isPro,
    createdAt: user.createdAt.toISOString(),
    hasPassword: user.password !== null,
  };
}

type ChangePasswordResult = { success: true } | { success: false; error: string };

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResult> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.password) {
    return {
      success: false,
      error: "This account signs in with GitHub and has no password to change.",
    };
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_ROUNDS);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { success: true };
}

/** Cascades to the user's items, collections, tags, sessions and accounts. */
export async function deleteAccount(userId: string): Promise<void> {
  await prisma.user.delete({ where: { id: userId } });
}
