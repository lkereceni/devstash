import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type {
  ItemStats,
  ItemSummary,
  ItemType,
} from "@/features/items/types";
import { prisma } from "@/lib/prisma";

/**
 * Stands in for the session lookup until NextAuth is wired up — every query is
 * scoped to the seeded demo user rather than to whoever is signed in.
 */
const DEMO_USER_EMAIL = "demo@devstash.io";

const OWNED_BY_CURRENT_USER: Prisma.ItemWhereInput = {
  user: { email: DEMO_USER_EMAIL },
};

/** Everything an item row renders, and nothing more — the content stays behind. */
const ITEM_SUMMARY_SELECT = {
  id: true,
  title: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  updatedAt: true,
  type: { select: { id: true, name: true, icon: true, color: true } },
  tags: {
    select: { tag: { select: { name: true } } },
    orderBy: { tag: { name: "asc" } },
  },
} satisfies Prisma.ItemSelect;

export async function getPinnedItems(): Promise<ItemSummary[]> {
  return findItems({ isPinned: true });
}

export async function getRecentItems(limit: number): Promise<ItemSummary[]> {
  return findItems({}, limit);
}

export async function getItemStats(): Promise<ItemStats> {
  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: OWNED_BY_CURRENT_USER }),
    prisma.item.count({
      where: { ...OWNED_BY_CURRENT_USER, isFavorite: true },
    }),
  ]);

  return { total, favorites };
}

/**
 * The system types (which have no owner) plus the current user's custom types,
 * counted over that user's items only.
 * Ordered by creation so the built-in types keep the order the spec lists them
 * in — the table has no explicit sort column.
 */
export async function getItemTypes(): Promise<ItemType[]> {
  const rows = await prisma.itemType.findMany({
    where: { OR: [{ userId: null }, { user: { email: DEMO_USER_EMAIL } }] },
    orderBy: [{ createdAt: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      icon: true,
      color: true,
      isSystem: true,
      _count: { select: { items: { where: OWNED_BY_CURRENT_USER } } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    // icon and color are nullable on custom types; fall back to a generic file.
    icon: row.icon ?? "File",
    color: row.color,
    isSystem: row.isSystem,
    itemCount: row._count.items,
  }));
}

async function findItems(
  where: Prisma.ItemWhereInput,
  take?: number
): Promise<ItemSummary[]> {
  const rows = await prisma.item.findMany({
    where: { ...OWNED_BY_CURRENT_USER, ...where },
    orderBy: { updatedAt: "desc" },
    take,
    select: ITEM_SUMMARY_SELECT,
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    type: {
      id: row.type.id,
      name: row.type.name,
      icon: row.type.icon ?? "File",
      color: row.type.color,
    },
    tags: row.tags.map(({ tag }) => tag.name),
    isFavorite: row.isFavorite,
    isPinned: row.isPinned,
    updatedAt: row.updatedAt.toISOString(),
  }));
}
