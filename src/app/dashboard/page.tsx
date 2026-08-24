import { Clock, Pin } from "lucide-react";

import { CollectionCard, getRecentCollections } from "@/features/collections";
import { DashboardSection, StatsCards } from "@/features/dashboard";
import { ItemRow, getPinnedItems, getRecentItems } from "@/features/items";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export default async function DashboardPage() {
  const [recentCollections, pinnedItems, recentItems] = await Promise.all([
    getRecentCollections(RECENT_COLLECTIONS_LIMIT),
    getPinnedItems(),
    getRecentItems(RECENT_ITEMS_LIMIT),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Your developer knowledge hub</p>
      </header>

      <StatsCards />

      <DashboardSection
        title="Collections"
        action={{ label: "View all", href: "/collections" }}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </DashboardSection>

      {pinnedItems.length > 0 ? (
        <DashboardSection title="Pinned" icon={Pin}>
          <div className="flex flex-col gap-3">
            {pinnedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </DashboardSection>
      ) : null}

      <DashboardSection
        title="Recent"
        icon={Clock}
        action={{ label: "View all", href: "/items" }}
      >
        <div className="flex flex-col gap-3">
          {recentItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
