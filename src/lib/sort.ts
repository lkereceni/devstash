/** Comparator for "newest first" by last update. */
export function byUpdatedAtDesc(
  a: { updatedAt: string },
  b: { updatedAt: string }
): number {
  return b.updatedAt.localeCompare(a.updatedAt);
}
