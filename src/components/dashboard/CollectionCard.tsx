import { Star } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ItemTypeIcon } from "@/components/dashboard/ItemTypeIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCollectionTypes } from "@/lib/dashboard";
import type { Collection } from "@/lib/mock-data";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const types = getCollectionTypes(collection.id);

  return (
    <Card
      className="relative border-l-4 border-l-(--collection-color) transition-colors hover:bg-muted/40"
      style={{ "--collection-color": collection.color } as CSSProperties}
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
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {collection.description}
        </p>
        <div className="flex items-center gap-2">
          {types.map((type) => (
            <ItemTypeIcon
              key={type.id}
              icon={type.icon}
              color={type.color}
              label={type.name}
              className="size-4"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
