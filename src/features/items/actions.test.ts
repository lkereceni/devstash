import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UpdateItemData } from "@/features/items/lib/items";
import type { ItemDetail } from "@/features/items/types";

// `auth`'s real type is NextAuth's overloaded function (plain call, or used
// as middleware), which `vi.mocked()` can't infer cleanly — so the mocks are
// declared with their own simple signatures instead of derived from it.
const mockAuth = vi.hoisted(() => vi.fn<() => Promise<Session | null>>());
const mockUpdateItem = vi.hoisted(() =>
  vi.fn<(id: string, data: UpdateItemData) => Promise<ItemDetail | null>>()
);
const mockDeleteItem = vi.hoisted(() => vi.fn<(id: string) => Promise<boolean>>());

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/features/items/lib/items", () => ({
  updateItem: mockUpdateItem,
  deleteItem: mockDeleteItem,
}));

import { deleteItemAction, updateItemAction } from "@/features/items/actions";

function sessionFor(userId: string): Session {
  return { user: { id: userId }, expires: "2099-01-01T00:00:00.000Z" };
}

function validInput(overrides: Partial<UpdateItemData> = {}): UpdateItemData {
  return {
    title: "useDebounce",
    description: "Delays a value until it settles",
    content: "export function useDebounce() {}",
    url: null,
    language: "typescript",
    tags: ["hooks", "react"],
    ...overrides,
  };
}

function itemDetailFor(overrides: Partial<ItemDetail> = {}): ItemDetail {
  return {
    id: "item-1",
    title: "useDebounce",
    description: "Delays a value until it settles",
    type: { id: "type-1", name: "Snippets", icon: "Code", color: "#3b82f6" },
    tags: ["hooks", "react"],
    isFavorite: false,
    isPinned: false,
    contentType: "text",
    content: "export function useDebounce() {}",
    url: null,
    language: "typescript",
    fileName: null,
    fileSize: null,
    collection: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("updateItemAction", () => {
  it("rejects when there is no session", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await updateItemAction("item-1", validInput());

    expect(result).toEqual({ success: false, error: "You must be signed in." });
    expect(mockUpdateItem).not.toHaveBeenCalled();
  });

  it("rejects an empty title", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));

    const result = await updateItemAction("item-1", validInput({ title: "  " }));

    expect(result).toEqual({ success: false, error: "Title is required" });
    expect(mockUpdateItem).not.toHaveBeenCalled();
  });

  it("rejects an invalid URL", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));

    const result = await updateItemAction(
      "item-1",
      validInput({ url: "not-a-valid-url" })
    );

    expect(result).toEqual({ success: false, error: "Enter a valid URL" });
    expect(mockUpdateItem).not.toHaveBeenCalled();
  });

  it("reports an error when the item is missing or not owned by the caller", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));
    mockUpdateItem.mockResolvedValue(null);

    const result = await updateItemAction("item-1", validInput());

    expect(result).toEqual({ success: false, error: "Item not found." });
  });

  it("delegates to updateItem with the parsed data and returns the updated item", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));
    const updated = itemDetailFor({ title: "useDebounce (edited)" });
    mockUpdateItem.mockResolvedValue(updated);

    const result = await updateItemAction("item-1", validInput());

    expect(mockUpdateItem).toHaveBeenCalledWith("item-1", validInput());
    expect(result).toEqual({ success: true, data: updated });
  });
});

describe("deleteItemAction", () => {
  it("rejects when there is no session", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await deleteItemAction("item-1");

    expect(result).toEqual({ success: false, error: "You must be signed in." });
    expect(mockDeleteItem).not.toHaveBeenCalled();
  });

  it("reports an error when the item is missing or not owned by the caller", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));
    mockDeleteItem.mockResolvedValue(false);

    const result = await deleteItemAction("item-1");

    expect(mockDeleteItem).toHaveBeenCalledWith("item-1");
    expect(result).toEqual({ success: false, error: "Item not found." });
  });

  it("deletes the item and reports success", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));
    mockDeleteItem.mockResolvedValue(true);

    const result = await deleteItemAction("item-1");

    expect(mockDeleteItem).toHaveBeenCalledWith("item-1");
    expect(result).toEqual({ success: true });
  });
});
