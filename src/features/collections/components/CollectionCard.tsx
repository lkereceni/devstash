import { Star } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Collection } from "@/features/collections/types";
import { ItemTypeIcon } from "@/features/items";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Card
      className="relative border-l-4 border-l-(--collection-color) transition-colors hover:bg-muted/40"
      style={
        {
          // An empty collection has no type to take its accent from.
          "--collection-color": collection.color ?? "var(--border)",
        } as CSSProperties
      }
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Link
            href={`/collections/${collection.id}`}
            className="after:absolute after:inset-0"
          >
            {collection.name}
          </Link>
          {collection.isFavorite ? (
            <Star
              role="img"
              aria-label="Favorite"
              className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
            />
          ) : null}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {collection.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {collection.description}
          </p>
        ) : null}
        <div className="flex items-center gap-2">
          {collection.types.map((type) => (
            <ItemTypeIcon
              key={type.id}
              icon={type.icon}
              color={type.color ?? undefined}
              label={type.name}
              className="size-4"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
