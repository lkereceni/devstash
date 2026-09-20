"use server";

import { z } from "zod";

import { auth } from "@/auth";
import { deleteItem, updateItem } from "@/features/items/lib/items";
import type { ItemDetail } from "@/features/items/types";

type UpdateItemResult =
  | { success: true; data: ItemDetail }
  | { success: false; error: string };

type DeleteItemResult = { success: true } | { success: false; error: string };

const updateItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().nullable(),
  content: z.string().nullable(),
  url: z.string().trim().url("Enter a valid URL").nullable(),
  language: z.string().trim().nullable(),
  tags: z.array(z.string().trim().min(1)),
});

export async function updateItemAction(
  itemId: string,
  input: {
    title: string;
    description: string | null;
    content: string | null;
    url: string | null;
    language: string | null;
    tags: string[];
  }
): Promise<UpdateItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = updateItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const item = await updateItem(itemId, parsed.data);
  if (!item) {
    return { success: false, error: "Item not found." };
  }

  return { success: true, data: item };
}

export async function deleteItemAction(itemId: string): Promise<DeleteItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const deleted = await deleteItem(itemId);
  if (!deleted) {
    return { success: false, error: "Item not found." };
  }

  return { success: true };
}
