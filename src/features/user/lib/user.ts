import { currentUser } from "@/features/user/lib/mock-user";
import type { User } from "@/features/user/types";

/** Stands in for the session lookup until NextAuth is wired up. */
export function getCurrentUser(): User {
  return currentUser;
}
