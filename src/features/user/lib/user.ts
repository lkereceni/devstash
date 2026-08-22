import type { User } from "@/features/user/types";
import { currentUser } from "@/lib/mock-data";

/** Stands in for the session lookup until NextAuth is wired up. */
export function getCurrentUser(): User {
  return currentUser;
}
