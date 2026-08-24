/**
 * Mock data for the dashboard UI.
 * Stands in for the Prisma layer for the parts of the UI that are not on the
 * database yet — only the current user is left. Items and collections come
 * from Prisma (src/features/<feature>/lib/).
 * The domain types live with their features. This is the one place allowed to
 * import from inside a feature rather than its barrel: going through the barrel
 * would pull the feature's components in here and create an import cycle.
 */

import type { User } from "@/features/user/types";

export const currentUser: User = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  avatarUrl: null,
  isPro: true,
};
