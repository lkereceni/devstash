"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createItemAction } from "@/features/items/actions";
import {
  isContentEditableItemType,
  isLanguageEditableItemType,
  isUrlEditableItemType,
} from "@/features/items/lib/item-types";
import type { ItemType } from "@/features/items/types";

interface ItemCreateDialogProps {
  types: ItemType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emptyForm = {
  title: "",
  description: "",
  content: "",
  language: "",
  url: "",
  tags: "",
};

export function ItemCreateDialog({
  types,
  open,
  onOpenChange,
}: ItemCreateDialogProps) {
  const router = useRouter();
  const [typeId, setTypeId] = useState(types[0]?.id ?? "");
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedType = types.find((type) => type.id === typeId) ?? null;
  const requiresUrl = selectedType ? isUrlEditableItemType(selectedType) : false;
  const canSubmit =
    typeId !== "" && form.title.trim() !== "" && (!requiresUrl || form.url.trim() !== "");

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setTypeId(types[0]?.id ?? "");
      setForm(emptyForm);
    }
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    setIsSubmitting(true);
    const result = await createItemAction({
      typeId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      content: form.content.trim() || null,
      url: form.url.trim() || null,
      language: form.language.trim() || null,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Item created");
    router.refresh();
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
          <DialogDescription>Add a new item to your stash.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-type">Type</Label>
            <Select
              value={typeId}
              onValueChange={(nextTypeId) => {
                setTypeId(nextTypeId);
                // Content/language/url are type-specific and hidden once the
                // type changes; clearing them stops a stray value typed under
                // a previous type (e.g. an invalid URL) from being silently
                // submitted, or blocking submit, under the new type.
                setForm((prev) => ({
                  ...prev,
                  content: "",
                  language: "",
                  url: "",
                }));
              }}
            >
              <SelectTrigger id="create-type" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-title">Title</Label>
            <Input
              id="create-title"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-description">Description</Label>
            <Textarea
              id="create-description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </div>

          {selectedType && isContentEditableItemType(selectedType) ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-content">Content</Label>
              <Textarea
                id="create-content"
                className="min-h-32 font-mono text-xs"
                value={form.content}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, content: event.target.value }))
                }
              />
            </div>
          ) : null}

          {selectedType && isLanguageEditableItemType(selectedType) ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-language">Language</Label>
              <Input
                id="create-language"
                value={form.language}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, language: event.target.value }))
                }
              />
            </div>
          ) : null}

          {selectedType && isUrlEditableItemType(selectedType) ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-url">URL</Label>
              <Input
                id="create-url"
                type="url"
                value={form.url}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, url: event.target.value }))
                }
                required
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-tags">Tags</Label>
            <Input
              id="create-tags"
              placeholder="comma, separated, tags"
              value={form.tags}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tags: event.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
