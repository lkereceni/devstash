"use client";

import { ChevronDown, Folder, FolderOpen, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

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
import type { Collection } from "@/features/collections/types";

const ALL_COLLECTIONS_HREF = "/collections";

interface CollectionsNavGroupProps {
  favoriteCollections: Collection[];
  recentCollections: Collection[];
}

export function CollectionsNavGroup({
  favoriteCollections,
  recentCollections,
}: CollectionsNavGroupProps) {
  const pathname = usePathname();

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="w-full gap-1 hover:text-sidebar-foreground">
            Collections
            <ChevronDown
              aria-hidden
              className="transition-transform group-data-[state=closed]/collapsible:-rotate-90"
            />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent className="flex flex-col gap-2">
            <CollectionList
              heading="Favorites"
              collections={favoriteCollections}
              pathname={pathname}
              badge="favorite"
            />
            <CollectionList
              heading="Recent"
              collections={recentCollections}
              pathname={pathname}
              badge="type-color"
            />
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === ALL_COLLECTIONS_HREF}
                  tooltip="View all collections"
                >
                  <Link href={ALL_COLLECTIONS_HREF}>
                    <FolderOpen aria-hidden />
                    <span>View all collections</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

interface CollectionListProps {
  heading: string;
  collections: Collection[];
  pathname: string;
  /** Trailing marker: a star, or a dot in the collection's dominant type colour. */
  badge: "favorite" | "type-color";
}

function CollectionList({
  heading,
  collections,
  pathname,
  badge,
}: CollectionListProps) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="px-2 py-1 text-[0.7rem] font-medium tracking-wider text-sidebar-foreground/50 uppercase group-data-[collapsible=icon]:hidden">
        {heading}
      </p>
      <SidebarMenu>
        {collections.map((collection) => {
          const href = `/collections/${collection.id}`;

          return (
            <SidebarMenuItem key={collection.id}>
              <SidebarMenuButton
                asChild
                isActive={pathname === href}
                tooltip={`${collection.name} (${collection.itemCount})`}
              >
                <Link href={href}>
                  <Folder aria-hidden />
                  <span>{collection.name}</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuBadge>
                {badge === "favorite" ? (
                  <Star
                    aria-label="Favorite"
                    className="size-3.5 fill-amber-400 text-amber-400"
                  />
                ) : (
                  <TypeColorDot color={collection.color} />
                )}
              </SidebarMenuBadge>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
}

/**
 * Stands for the item type the collection holds most of — `Collection.color` is
 * already derived from it. Decorative: the collection name carries the meaning.
 */
function TypeColorDot({ color }: { color: string | null }) {
  return (
    <span
      aria-hidden
      className="size-2.5 rounded-full bg-(--type-color)"
      style={
        {
          "--type-color": color ?? "var(--color-muted-foreground)",
        } as CSSProperties
      }
    />
  );
}
