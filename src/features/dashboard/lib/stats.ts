import { getCollectionStats } from "@/features/collections";
import type { DashboardStats } from "@/features/dashboard/types";
import { getItemStats } from "@/features/items";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [items, collections] = await Promise.all([
    getItemStats(),
    getCollectionStats(),
  ]);

  return {
    items: items.total,
    collections: collections.total,
    favoriteItems: items.favorites,
    favoriteCollections: collections.favorites,
  };
}
