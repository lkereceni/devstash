"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Copy, Pencil, Pin, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ItemTypeIcon } from "@/features/items/components/ItemTypeIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLongDate } from "@/features/items/lib/format";
import type { ItemDetail } from "@/features/items/types";

interface ItemDrawerProps {
  itemId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ItemDetailResponse =
  | { success: true; data: ItemDetail }
  | { success: false; error: string };

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function ItemDrawer({ itemId, open, onOpenChange }: ItemDrawerProps) {
  const [fetchedItem, setItem] = useState<ItemDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  // The id `fetchedItem`/`loadError` was fetched for — lets loading state be
  // derived instead of reset synchronously at the top of the effect (which
  // react-hooks flags).
  const [loadedId, setLoadedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !itemId) return;

    let cancelled = false;

    async function loadItem() {
      setLoadError(null);
      try {
        const response = await fetch(`/api/items/${itemId}`);
        const body: ItemDetailResponse = await response.json();
        if (cancelled) return;

        if (body.success) {
          setItem(body.data);
        } else {
          setLoadError(body.error);
          toast.error(body.error);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Failed to load item");
          toast.error("Failed to load item");
        }
      } finally {
        if (!cancelled) setLoadedId(itemId);
      }
    }

    loadItem();

    return () => {
      cancelled = true;
    };
  }, [itemId, open]);

  const isLoading = itemId !== null && loadedId !== itemId;
  const item = fetchedItem?.id === itemId ? fetchedItem : null;
  const error = loadedId === itemId ? loadError : null;

  async function handleCopy() {
    if (!item?.content) return;
    await navigator.clipboard.writeText(item.content);
    toast.success("Copied to clipboard");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full gap-0 overflow-x-hidden overflow-y-auto data-[side=right]:sm:max-w-lg data-[side=right]:lg:max-w-xl data-[side=right]:xl:max-w-2xl"
      >
        {isLoading ? (
          <ItemDrawerSkeleton />
        ) : error || !item ? (
          <p className="p-4 text-sm text-muted-foreground">
            {error ?? "Item not found."}
          </p>
        ) : (
          <>
            <SheetHeader className="gap-3 border-b pb-4">
              <div className="flex items-center gap-2 pr-8">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ItemTypeIcon
                    icon={item.type.icon}
                    color={item.type.color ?? undefined}
                    label={item.type.name}
                    className="size-4"
                  />
                </span>
                <SheetTitle className="truncate text-lg">
                  {item.title}
                </SheetTitle>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary">{item.type.name}</Badge>
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Favorite"
                  aria-pressed={item.isFavorite}
                  className={item.isFavorite ? "text-amber-400" : undefined}
                >
                  <Star
                    className={item.isFavorite ? "fill-amber-400" : undefined}
                  />
                  <span className="hidden sm:inline">Favorite</span>
                </Button>
                <Button
                  variant={item.isPinned ? "secondary" : "ghost"}
                  size="sm"
                  aria-label="Pin"
                  aria-pressed={item.isPinned}
                >
                  <Pin />
                  <span className="hidden sm:inline">Pin</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Copy"
                  onClick={handleCopy}
                  disabled={!item.content}
                >
                  <Copy />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
                <Separator orientation="vertical" className="h-5" />
                <Button variant="ghost" size="sm" aria-label="Edit">
                  <Pencil />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Delete"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </SheetHeader>

            <div className="flex min-w-0 flex-col gap-6 p-4">
              {item.description ? (
                <DetailSection title="Description">
                  <p className="text-sm">{item.description}</p>
                </DetailSection>
              ) : null}

              {item.content ? (
                <DetailSection title="Content">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">
                    <code>{item.content}</code>
                  </pre>
                </DetailSection>
              ) : null}

              {item.url ? (
                <DetailSection title="URL">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-primary underline underline-offset-2"
                  >
                    {item.url}
                  </a>
                </DetailSection>
              ) : null}

              {item.fileName ? (
                <DetailSection title="File">
                  <p className="text-sm">
                    {item.fileName}
                    {item.fileSize
                      ? ` · ${formatFileSize(item.fileSize)}`
                      : ""}
                  </p>
                </DetailSection>
              ) : null}

              <DetailSection title="Collections">
                {item.collection ? (
                  <Badge variant="secondary" className="w-fit">
                    {item.collection.name}
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Not in a collection
                  </p>
                )}
              </DetailSection>

              <div className="grid grid-cols-2 gap-3 border-t pt-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p>{formatLongDate(item.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Updated</p>
                  <p>{formatLongDate(item.updatedAt)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

function ItemDrawerSkeleton() {
  return (
    <>
      <SheetHeader className="gap-3 border-b pb-4">
        <div className="flex items-center gap-2 pr-8">
          <Skeleton className="size-9 shrink-0 rounded-lg" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-4xl" />
          <Skeleton className="h-5 w-12 rounded-4xl" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-14 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-14 rounded-lg" />
        </div>
      </SheetHeader>
      <div className="flex flex-col gap-6 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </>
  );
}
