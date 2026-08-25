"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ItemTypeIcon } from "@/features/items/components/ItemTypeIcon";
import {
  getItemTypeHref,
  isProItemType,
} from "@/features/items/lib/item-types";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { ItemType } from "@/features/items/types";

interface ItemTypesNavGroupProps {
  itemTypes: ItemType[];
}

export function ItemTypesNavGroup({ itemTypes }: ItemTypesNavGroupProps) {
  const pathname = usePathname();

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="w-full gap-1 hover:text-sidebar-foreground">
            Types
            <ChevronDown
              aria-hidden
              className="transition-transform group-data-[state=closed]/collapsible:-rotate-90"
            />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemTypes.map((type) => {
                const href = getItemTypeHref(type);
                const isPro = isProItemType(type);
                const tooltip = `${type.name} (${type.itemCount})`;

                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === href}
                      tooltip={isPro ? `${tooltip} · Pro` : tooltip}
                    >
                      <Link href={href}>
                        <ItemTypeIcon
                          icon={type.icon}
                          color={type.color ?? undefined}
                        />
                        {/* Explicit: the badge takes the button's
                            span:last-child truncate rule on Pro rows. */}
                        <span className="truncate">{type.name}</span>
                        {isPro && (
                          <Badge
                            variant="outline"
                            className="h-4 px-1 text-[0.7rem] font-semibold tracking-wider text-muted-foreground"
                          >
                            PRO
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{type.itemCount}</SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
