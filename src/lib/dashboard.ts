import {
  collections,
  items,
  itemTypes,
  type Collection,
  type Item,
  type ItemType,
} from "@/lib/mock-data";

export interface DashboardStats {
  items: number;
  collections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

/** Newest first, by last update. */
function byUpdatedAtDesc(a: { updatedAt: string }, b: { updatedAt: string }) {
  return b.updatedAt.localeCompare(a.updatedAt);
}

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

export function getRecentCollections(limit: number): Collection[] {
  return [...collections].sort(byUpdatedAtDesc).slice(0, limit);
}

export function getPinnedItems(): Item[] {
  return items.filter((item) => item.isPinned).sort(byUpdatedAtDesc);
}

export function getRecentItems(limit: number): Item[] {
  return [...items].sort(byUpdatedAtDesc).slice(0, limit);
}

export function getItemType(typeId: string): ItemType | undefined {
  return itemTypes.find((type) => type.id === typeId);
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
