import { Pin, Star } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ItemTypeIcon } from "@/components/dashboard/ItemTypeIcon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getItemType } from "@/lib/dashboard";
import { formatShortDate } from "@/lib/format";
import { getItemTypeHref } from "@/lib/item-types";
import type { Item } from "@/lib/mock-data";

interface ItemRowProps {
  item: Item;
}

export function ItemRow({ item }: ItemRowProps) {
  const type = getItemType(item.typeId);
  // Item pages sit under their type listing so they cannot collide with it.
  const href = type ? `${getItemTypeHref(type)}/${item.id}` : `/items/${item.id}`;

  return (
    <Card
      className="relative flex-row items-start gap-3 border-l-4 border-l-(--item-color) px-4 transition-colors hover:bg-muted/40"
      style={
        { "--item-color": type?.color ?? "var(--border)" } as CSSProperties
      }
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <ItemTypeIcon
          icon={type?.icon ?? "File"}
          color={type?.color}
          label={type?.name}
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
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {item.description}
        </p>
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
