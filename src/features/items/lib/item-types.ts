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

import type { ItemType } from "@/features/items/types";

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

/** Route for an item type listing, e.g. Snippets -> /items/snippets. */
export function getItemTypeHref(type: ItemType): string {
  const slug = type.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `/items/${slug}`;
}
