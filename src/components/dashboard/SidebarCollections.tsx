"use client";

import { ChevronDown, Folder, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
import { collections as allCollections, type Collection } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

const favoriteCollections = allCollections.filter(
  (collection) => collection.isFavorite
);

// Favourites already have their own section, so "recent" covers the rest.
const recentCollections = allCollections
  .filter((collection) => !collection.isFavorite)
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  .slice(0, RECENT_COLLECTIONS_LIMIT);

export function SidebarCollections() {
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
              showFavoriteIcon
            />
            <CollectionList
              heading="Recent"
              collections={recentCollections}
              pathname={pathname}
            />
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
  showFavoriteIcon?: boolean;
}

function CollectionList({
  heading,
  collections,
  pathname,
  showFavoriteIcon = false,
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
              {showFavoriteIcon ? (
                <SidebarMenuBadge>
                  <Star
                    aria-label="Favorite"
                    className="size-3.5 fill-amber-400 text-amber-400"
                  />
                </SidebarMenuBadge>
              ) : (
                <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
}
