"use client";

import { Pin, Star } from "lucide-react";
import type { CSSProperties } from "react";

import { ItemTypeIcon } from "@/features/items/components/ItemTypeIcon";
import { useItemDrawer } from "@/features/items/components/ItemDrawerProvider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate } from "@/features/items/lib/format";
import type { ItemSummary } from "@/features/items/types";

interface ItemCardProps {
  item: ItemSummary;
}

export function ItemCard({ item }: ItemCardProps) {
  const { type } = item;
  const { openItem } = useItemDrawer();

  return (
    <Card
      className="relative border-l-4 border-l-(--item-color) transition-colors hover:bg-muted/40"
      style={{ "--item-color": type.color ?? "var(--border)" } as CSSProperties}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <ItemTypeIcon
            icon={type.icon}
            color={type.color ?? undefined}
            label={type.name}
            className="size-4 shrink-0"
          />
          <button
            type="button"
            onClick={() => openItem(item.id)}
            className="truncate text-left after:absolute after:inset-0"
          >
            {item.title}
          </button>
          {item.isPinned ? (
            <Pin
              role="img"
              aria-label="Pinned"
              className="size-3.5 shrink-0 text-muted-foreground"
            />
          ) : null}
          {item.isFavorite ? (
            <Star
              role="img"
              aria-label="Favorite"
              className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
            />
          ) : null}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {formatShortDate(item.updatedAt)}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {item.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        ) : null}
        {item.tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
