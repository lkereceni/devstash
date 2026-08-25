import {
  Code,
  File,
  FileText,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import type { ItemTypeSummary } from "@/features/items/types";

/**
 * Maps the lucide icon names stored on an item type to their components.
 * Item types are data (custom types are a Pro feature), so the icon arrives
 * as a string and has to be resolved at render time.
 */
export const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  File,
  FileText,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
};

/**
 * Item types that are only usable on the Pro plan. There is no column for this
 * on `item_types` yet, so the built-in types are listed by name until the plan
 * model lands.
 */
const PRO_ITEM_TYPE_NAMES = new Set(["Files", "Images"]);

/** Whether an item type is gated behind the Pro plan. */
export function isProItemType(type: ItemTypeSummary): boolean {
  return PRO_ITEM_TYPE_NAMES.has(type.name);
}

/** Route for an item type listing, e.g. Snippets -> /items/snippets. */
export function getItemTypeHref(type: ItemTypeSummary): string {
  const slug = type.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `/items/${slug}`;
}
