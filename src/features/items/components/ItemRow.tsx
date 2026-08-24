import { Pin, Star } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ItemTypeIcon } from "@/features/items/components/ItemTypeIcon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getItemTypeHref } from "@/features/items/lib/item-types";
import type { ItemSummary } from "@/features/items/types";
import { formatShortDate } from "@/lib/format";

interface ItemRowProps {
  item: ItemSummary;
}

export function ItemRow({ item }: ItemRowProps) {
  const { type } = item;
  // Item pages sit under their type listing so they cannot collide with it.
  const href = `${getItemTypeHref(type)}/${item.id}`;

  return (
    <Card
      className="relative flex-row items-start gap-3 border-l-4 border-l-(--item-color) px-4 transition-colors hover:bg-muted/40"
      style={{ "--item-color": type.color ?? "var(--border)" } as CSSProperties}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <ItemTypeIcon
          icon={type.icon}
          color={type.color ?? undefined}
          label={type.name}
          className="size-4"
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Link
            href={href}
            className="truncate font-medium after:absolute after:inset-0"
          >
            {item.title}
          </Link>
          {item.isPinned ? (
            <Pin
              aria-label="Pinned"
              className="size-3.5 shrink-0 text-muted-foreground"
            />
          ) : null}
          {item.isFavorite ? (
            <Star
              aria-label="Favorite"
              className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
            />
          ) : null}
        </div>
        {item.description ? (
          <p className="line-clamp-1 text-sm text-muted-foreground">
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
      </div>
      <time
        dateTime={item.updatedAt}
        className="shrink-0 text-xs text-muted-foreground"
      >
        {formatShortDate(item.updatedAt)}
      </time>
    </Card>
  );
}
