import type { Prisma } from "@/generated/prisma/client";
import type {
  Collection,
  CollectionItemType,
  CollectionStats,
} from "@/features/collections/types";
import { prisma } from "@/lib/prisma";

/**
 * Stands in for the session lookup until NextAuth is wired up — every query is
 * scoped to the seeded demo user rather than to whoever is signed in.
 */
const DEMO_USER_EMAIL = "demo@devstash.io";

const OWNED_BY_CURRENT_USER: Prisma.CollectionWhereInput = {
  user: { email: DEMO_USER_EMAIL },
};

interface RecentCollectionOptions {
  /** Skip favourites, for surfaces that already list them separately. */
  excludeFavorites?: boolean;
}

export async function getFavoriteCollections(): Promise<Collection[]> {
  return findCollections({ isFavorite: true });
}

export async function getRecentCollections(
  limit: number,
  { excludeFavorites = false }: RecentCollectionOptions = {}
): Promise<Collection[]> {
  return findCollections(excludeFavorites ? { isFavorite: false } : {}, limit);
}

export async function getCollectionStats(): Promise<CollectionStats> {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: OWNED_BY_CURRENT_USER }),
    prisma.collection.count({
      where: { ...OWNED_BY_CURRENT_USER, isFavorite: true },
    }),
  ]);

  return { total, favorites };
}

async function findCollections(
  where: Prisma.CollectionWhereInput,
  take?: number
): Promise<Collection[]> {
  const rows = await prisma.collection.findMany({
    where: { ...OWNED_BY_CURRENT_USER, ...where },
    orderBy: { updatedAt: "desc" },
    take,
    include: { _count: { select: { items: true } } },
  });

  if (rows.length === 0) {
    return [];
  }

  const typesByCollection = await getTypesByCollection(
    rows.map((row) => row.id)
  );

  return rows.map((row) => {
    const types = typesByCollection.get(row.id) ?? [];

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      // Accent comes from the type the collection holds most of. The
      // collections.color column is not used yet — nothing sets it.
      color: types[0]?.color ?? null,
      isFavorite: row.isFavorite,
      itemCount: row._count.items,
      types,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  });
}

/**
 * The item types each collection holds, most used first.
 * Two queries for the whole grid — grouping the items by type, then resolving
 * those types — rather than one round trip per card.
 */
async function getTypesByCollection(
  collectionIds: string[]
): Promise<Map<string, CollectionItemType[]>> {
  const grouped = await prisma.item.groupBy({
    by: ["collectionId", "typeId"],
    where: { collectionId: { in: collectionIds } },
    _count: { _all: true },
  });

  if (grouped.length === 0) {
    return new Map();
  }

  const types = await prisma.itemType.findMany({
    where: { id: { in: [...new Set(grouped.map((group) => group.typeId))] } },
    select: { id: true, name: true, icon: true, color: true },
  });
  const typeById = new Map(types.map((type) => [type.id, type]));

  const byCollection = new Map<string, CollectionItemType[]>();

  for (const group of grouped) {
    const type = typeById.get(group.typeId);

    // collectionId is nullable on Item; the `in` filter already excluded nulls.
    if (!group.collectionId || !type) {
      continue;
    }

    const collectionTypes = byCollection.get(group.collectionId) ?? [];
    collectionTypes.push({
      id: type.id,
      name: type.name,
      icon: type.icon ?? "File",
      color: type.color,
      itemCount: group._count._all,
    });
    byCollection.set(group.collectionId, collectionTypes);
  }

  for (const collectionTypes of byCollection.values()) {
    collectionTypes.sort(
      (a, b) => b.itemCount - a.itemCount || a.name.localeCompare(b.name)
    );
  }

  return byCollection;
}
