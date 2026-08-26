import { File } from "lucide-react";
import type { CSSProperties } from "react";

import { ITEM_TYPE_ICONS } from "@/features/items/lib/item-types";
import { cn } from "@/lib/utils";

interface ItemTypeIconProps {
  /** Lucide icon name stored on the item type, e.g. "Code". */
  icon: string;
  /** Item type colour, applied through a CSS variable. */
  color?: string;
  label?: string;
  className?: string;
}

export function ItemTypeIcon({
  icon,
  color,
  label,
  className,
}: ItemTypeIconProps) {
  const Icon = ITEM_TYPE_ICONS[icon] ?? File;

  return (
    <Icon
      // lucide renders a bare <svg>, which has no mapped role — without this the
      // aria-label is not reliably exposed to assistive tech.
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("text-(--type-color)", className)}
      style={{ "--type-color": color ?? "currentColor" } as CSSProperties}
    />
  );
}
