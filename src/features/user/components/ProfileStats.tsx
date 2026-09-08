import { FolderOpen, Layers } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ItemTypeIcon,
  getItemStats,
  getItemTypes,
} from "@/features/items";
import { getCollectionStats } from "@/features/collections";

export async function ProfileStats() {
  const [itemStats, itemTypes, collectionStats] = await Promise.all([
    getItemStats(),
    getItemTypes(),
    getCollectionStats(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Layers aria-hidden className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-2xl leading-tight font-semibold tabular-nums">
                {itemStats.total}
              </p>
              <p className="text-xs leading-snug text-muted-foreground">Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FolderOpen aria-hidden className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-2xl leading-tight font-semibold tabular-nums">
                {collectionStats.total}
              </p>
              <p className="text-xs leading-snug text-muted-foreground">Collections</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items by type</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2">
            {itemTypes.map((type) => (
              <li key={type.id} className="flex items-center gap-2 text-sm">
                <ItemTypeIcon icon={type.icon} color={type.color ?? undefined} className="size-4" />
                <span className="flex-1 truncate">{type.name}</span>
                <span className="tabular-nums text-muted-foreground">{type.itemCount}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
