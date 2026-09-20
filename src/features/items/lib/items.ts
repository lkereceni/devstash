import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { matchesItemTypeSlug } from "@/features/items/lib/item-types";
import type {
  ItemDetail,
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

/**
 * Resolves a `/items/[type]` route segment back to its item type. There is no
 * slug column on `item_types`, so this matches the same derivation
 * `getItemTypeHref` uses against every type visible to the current user.
 */
export async function getItemTypeBySlug(slug: string): Promise<ItemType | null> {
  const types = await getItemTypes();
  return types.find((type) => matchesItemTypeSlug(type, slug)) ?? null;
}

export async function getItemsByType(typeId: string): Promise<ItemSummary[]> {
  return findItems({ typeId });
}

/** Everything the drawer's detail view renders for a single item. */
const ITEM_DETAIL_SELECT = {
  id: true,
  title: true,
  description: true,
  contentType: true,
  content: true,
  url: true,
  language: true,
  fileName: true,
  fileSize: true,
  isFavorite: true,
  isPinned: true,
  createdAt: true,
  updatedAt: true,
  type: { select: { id: true, name: true, icon: true, color: true } },
  tags: {
    select: { tag: { select: { name: true } } },
    orderBy: { tag: { name: "asc" } },
  },
  collection: { select: { id: true, name: true } },
} satisfies Prisma.ItemSelect;

type ItemDetailRow = Prisma.ItemGetPayload<{ select: typeof ITEM_DETAIL_SELECT }>;

function mapItemDetail(row: ItemDetailRow): ItemDetail {
  return {
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
    contentType: row.contentType,
    content: row.content,
    url: row.url,
    language: row.language,
    fileName: row.fileName,
    fileSize: row.fileSize,
    collection: row.collection,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** The item drawer's detail fetch. Returns null for a missing or unowned id. */
export async function getItemById(id: string): Promise<ItemDetail | null> {
  const row = await prisma.item.findFirst({
    where: { id, ...OWNED_BY_CURRENT_USER },
    select: ITEM_DETAIL_SELECT,
  });
  if (!row) return null;

  return mapItemDetail(row);
}

export interface UpdateItemData {
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
}

/**
 * The item drawer's edit-mode save. Returns null for a missing or unowned id.
 * Tags are replaced wholesale — disconnect everything the item currently
 * carries, then connect-or-create the submitted set, same as the seed script.
 */
export async function updateItem(
  id: string,
  data: UpdateItemData
): Promise<ItemDetail | null> {
  const existing = await prisma.item.findFirst({
    where: { id, ...OWNED_BY_CURRENT_USER },
    select: { userId: true },
  });
  if (!existing) return null;

  const row = await prisma.item.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      language: data.language,
      tags: {
        deleteMany: {},
        create: data.tags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { userId_name: { userId: existing.userId, name } },
              create: { name, userId: existing.userId },
            },
          },
        })),
      },
    },
    select: ITEM_DETAIL_SELECT,
  });

  return mapItemDetail(row);
}

/**
 * The item drawer's delete action. Returns false for a missing or unowned id
 * rather than throwing, so the caller can turn it into a user-facing error.
 * `ItemTag` cascades on `Item` delete, so tags need no separate cleanup.
 */
export async function deleteItem(id: string): Promise<boolean> {
  const existing = await prisma.item.findFirst({
    where: { id, ...OWNED_BY_CURRENT_USER },
    select: { id: true },
  });
  if (!existing) return false;

  await prisma.item.delete({ where: { id } });
  return true;
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
