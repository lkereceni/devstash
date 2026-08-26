/**
 * Stands in for the Prisma layer for the one part of the UI that is not on the
 * database yet — the signed-in user. Items and collections come from Prisma
 * (src/features/<feature>/lib/). Retire this when NextAuth lands.
 */

import type { User } from "@/features/user/types";

export const currentUser: User = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  avatarUrl: null,
  isPro: true,
};
