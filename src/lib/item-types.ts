import {
  Code,
  File,
  FileText,
  Image,
  Link,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import type { ItemType } from "@/lib/mock-data";

/**
 * Maps the lucide icon names stored on an item type to their components.
 * Item types are data (custom types are a Pro feature), so the icon arrives
 * as a string and has to be resolved at render time.
 */
const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  File,
  FileText,
  Image,
  Link,
  Sparkles,
  Terminal,
};

export function getItemTypeIcon(iconName: string): LucideIcon {
  return ITEM_TYPE_ICONS[iconName] ?? File;
}

/** Route for an item type listing, e.g. Snippets -> /items/snippets. */
export function getItemTypeHref(type: ItemType): string {
  const slug = type.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `/items/${slug}`;
}
