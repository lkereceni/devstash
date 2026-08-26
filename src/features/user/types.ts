export interface User {
  id: string;
  /** Null for an OAuth account that supplied no name — fall back to the email. */
  name: string | null;
  email: string;
  avatarUrl: string | null;
  isPro: boolean;
}
