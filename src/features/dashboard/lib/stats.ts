import { getCollectionStats } from "@/features/collections";
import type { DashboardStats } from "@/features/dashboard/types";
import { items } from "@/lib/mock-data";

export async function getDashboardStats(): Promise<DashboardStats> {
  // Collections come from the database; items are still mock data.
  const collections = await getCollectionStats();

  return {
    items: items.length,
    collections: collections.total,
    favoriteItems: items.filter((item) => item.isFavorite).length,
    favoriteCollections: collections.favorites,
  };
}
