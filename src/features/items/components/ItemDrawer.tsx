"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Pencil, Pin, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { ItemTypeIcon } from "@/features/items/components/ItemTypeIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { updateItemAction } from "@/features/items/actions";
import { formatLongDate } from "@/features/items/lib/format";
import {
  isContentEditableItemType,
  isLanguageEditableItemType,
  isUrlEditableItemType,
} from "@/features/items/lib/item-types";
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
  const router = useRouter();
  const [fetchedItem, setItem] = useState<ItemDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  // The id `fetchedItem`/`loadError` was fetched for — lets loading state be
  // derived instead of reset synchronously at the top of the effect (which
  // react-hooks flags).
  const [loadedId, setLoadedId] = useState<string | null>(null);

  // The id edit mode is active for — lets `isEditing` be derived below rather
  // than reset synchronously in an effect when the item or open state changes.
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [editUrl, setEditUrl] = useState("");

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
  const isEditing = open && editingItemId !== null && editingItemId === itemId;

  async function handleCopy() {
    if (!item?.content) return;
    await navigator.clipboard.writeText(item.content);
    toast.success("Copied to clipboard");
  }

  function handleStartEdit() {
    if (!item) return;
    setEditTitle(item.title);
    setEditDescription(item.description ?? "");
    setEditTags(item.tags.join(", "));
    setEditContent(item.content ?? "");
    setEditLanguage(item.language ?? "");
    setEditUrl(item.url ?? "");
    setEditingItemId(item.id);
  }

  function handleCancelEdit() {
    setEditingItemId(null);
  }

  async function handleSaveEdit() {
    if (!item || !editTitle.trim()) return;

    setIsSaving(true);
    const result = await updateItemAction(item.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
      content: editContent.trim() || null,
      url: editUrl.trim() || null,
      language: editLanguage.trim() || null,
      tags: editTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setItem(result.data);
    setEditingItemId(null);
    toast.success("Item updated");
    router.refresh();
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
                {!isEditing &&
                  item.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Cancel"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      <X />
                      <span className="hidden sm:inline">Cancel</span>
                    </Button>
                    <Button
                      size="sm"
                      aria-label="Save"
                      onClick={handleSaveEdit}
                      disabled={isSaving || !editTitle.trim()}
                    >
                      {isSaving ? <Spinner /> : <Check />}
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                  </>
                ) : (
                  <>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Edit"
                      onClick={handleStartEdit}
                    >
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
                  </>
                )}
              </div>
            </SheetHeader>

            <div className="flex min-w-0 flex-col gap-6 p-4">
              {isEditing ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editDescription}
                      onChange={(event) =>
                        setEditDescription(event.target.value)
                      }
                    />
                  </div>
                  {isContentEditableItemType(item.type) ? (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="edit-content">Content</Label>
                      <Textarea
                        id="edit-content"
                        className="min-h-32 font-mono text-xs"
                        value={editContent}
                        onChange={(event) =>
                          setEditContent(event.target.value)
                        }
                      />
                    </div>
                  ) : null}
                  {isLanguageEditableItemType(item.type) ? (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="edit-language">Language</Label>
                      <Input
                        id="edit-language"
                        value={editLanguage}
                        onChange={(event) =>
                          setEditLanguage(event.target.value)
                        }
                      />
                    </div>
                  ) : null}
                  {isUrlEditableItemType(item.type) ? (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="edit-url">URL</Label>
                      <Input
                        id="edit-url"
                        type="url"
                        value={editUrl}
                        onChange={(event) => setEditUrl(event.target.value)}
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-tags">Tags</Label>
                    <Input
                      id="edit-tags"
                      placeholder="comma, separated, tags"
                      value={editTags}
                      onChange={(event) => setEditTags(event.target.value)}
                    />
                  </div>
                  <ItemMeta item={item} />
                </>
              ) : (
                <>
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

                  <ItemMeta item={item} />
                </>
              )}
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

/**
 * Collections and the created/updated dates — shared by view and edit mode,
 * since neither is editable there, only "managed separately" per the spec.
 */
function ItemMeta({ item }: { item: ItemDetail }) {
  return (
    <>
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
    </>
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
