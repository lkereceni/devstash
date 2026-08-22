import type { DashboardStats } from "@/features/dashboard/types";
import { collections, items } from "@/lib/mock-data";

export function getDashboardStats(): DashboardStats {
  return {
    items: items.length,
    collections: collections.length,
    favoriteItems: items.filter((item) => item.isFavorite).length,
    favoriteCollections: collections.filter(
      (collection) => collection.isFavorite
    ).length,
  };
}
