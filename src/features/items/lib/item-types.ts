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

/**
 * Which type-specific fields the edit form shows for a given item type. There
 * is no column for this on `item_types`, so — same as `PRO_ITEM_TYPE_NAMES` —
 * the built-in types are listed by name until a richer type model lands.
 */
const CONTENT_EDITABLE_TYPE_NAMES = new Set([
  "Snippets",
  "Prompts",
  "Commands",
  "Notes",
]);
const LANGUAGE_EDITABLE_TYPE_NAMES = new Set(["Snippets", "Commands"]);
const URL_EDITABLE_TYPE_NAMES = new Set(["Links"]);

export function isContentEditableItemType(type: ItemTypeSummary): boolean {
  return CONTENT_EDITABLE_TYPE_NAMES.has(type.name);
}

export function isLanguageEditableItemType(type: ItemTypeSummary): boolean {
  return LANGUAGE_EDITABLE_TYPE_NAMES.has(type.name);
}

export function isUrlEditableItemType(type: ItemTypeSummary): boolean {
  return URL_EDITABLE_TYPE_NAMES.has(type.name);
}

/** Derives the `/items/[type]` route segment from a type's name. */
function slugifyItemTypeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Route for an item type listing, e.g. Snippets -> /items/snippets. */
export function getItemTypeHref(type: ItemTypeSummary): string {
  return `/items/${slugifyItemTypeName(type.name)}`;
}

/** Whether a type is the one a `/items/[type]` route segment refers to. */
export function matchesItemTypeSlug(
  type: ItemTypeSummary,
  slug: string
): boolean {
  return slugifyItemTypeName(type.name) === slug;
}
