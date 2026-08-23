import { CollectionsNavGroup } from "@/features/collections/components/CollectionsNavGroup";
import {
  getFavoriteCollections,
  getRecentCollections,
} from "@/features/collections/lib/collections";

const RECENT_COLLECTIONS_LIMIT = 5;

/** Fetches the sidebar's collections; the group itself is interactive. */
export async function CollectionsNav() {
  const [favoriteCollections, recentCollections] = await Promise.all([
    getFavoriteCollections(),
    // Favourites already have their own section, so "recent" covers the rest.
    getRecentCollections(RECENT_COLLECTIONS_LIMIT, { excludeFavorites: true }),
  ]);

  return (
    <CollectionsNavGroup
      favoriteCollections={favoriteCollections}
      recentCollections={recentCollections}
    />
  );
}
