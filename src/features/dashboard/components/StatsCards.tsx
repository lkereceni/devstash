import { FolderHeart, FolderOpen, Layers, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/features/dashboard/lib/stats";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCards() {
  const stats = getDashboardStats();

  const cards: Stat[] = [
    { label: "Items", value: stats.items, icon: Layers },
    { label: "Collections", value: stats.collections, icon: FolderOpen },
    { label: "Favorite items", value: stats.favoriteItems, icon: Star },
    {
      label: "Favorite collections",
      value: stats.favoriteCollections,
      icon: FolderHeart,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <card.icon aria-hidden className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-2xl leading-tight font-semibold tabular-nums">
                {card.value}
              </p>
              <p className="text-xs leading-snug text-muted-foreground">
                {card.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
