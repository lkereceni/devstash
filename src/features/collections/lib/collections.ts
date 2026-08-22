import type { Collection } from "@/features/collections/types";
import type { ItemType } from "@/features/items";
import { collections, items, itemTypes } from "@/lib/mock-data";
import { byUpdatedAtDesc } from "@/lib/sort";

interface RecentCollectionOptions {
  /** Skip favourites, for surfaces that already list them separately. */
  excludeFavorites?: boolean;
}

export function getFavoriteCollections(): Collection[] {
  return collections.filter((collection) => collection.isFavorite);
}

export function getRecentCollections(
  limit: number,
  { excludeFavorites = false }: RecentCollectionOptions = {}
): Collection[] {
  return collections
    .filter((collection) => !excludeFavorites || !collection.isFavorite)
    .sort(byUpdatedAtDesc)
    .slice(0, limit);
}

/** The distinct item types a collection holds, for the icon row on its card. */
export function getCollectionTypes(collectionId: string): ItemType[] {
  const typeIds = new Set(
    items
      .filter((item) => item.collectionId === collectionId)
      .map((item) => item.typeId)
  );

  return itemTypes.filter((type) => typeIds.has(type.id));
}
