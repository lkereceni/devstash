import type { Item, ItemType } from "@/features/items/types";
import { items, itemTypes } from "@/lib/mock-data";
import { byUpdatedAtDesc } from "@/lib/sort";

export function getItemTypes(): ItemType[] {
  return itemTypes;
}

export function getItemType(typeId: string): ItemType | undefined {
  return itemTypes.find((type) => type.id === typeId);
}

export function getPinnedItems(): Item[] {
  return items.filter((item) => item.isPinned).sort(byUpdatedAtDesc);
}

export function getRecentItems(limit: number): Item[] {
  return [...items].sort(byUpdatedAtDesc).slice(0, limit);
}
