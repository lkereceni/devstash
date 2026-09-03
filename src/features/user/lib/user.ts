import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { User } from "@/features/user/types";

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
