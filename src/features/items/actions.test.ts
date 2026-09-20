import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CreateItemData, UpdateItemData } from "@/features/items/lib/items";
import type { ItemDetail, ItemType } from "@/features/items/types";

// `auth`'s real type is NextAuth's overloaded function (plain call, or used
// as middleware), which `vi.mocked()` can't infer cleanly — so the mocks are
// declared with their own simple signatures instead of derived from it.
const mockAuth = vi.hoisted(() => vi.fn<() => Promise<Session | null>>());
const mockCreateItem = vi.hoisted(() =>
  vi.fn<(data: CreateItemData) => Promise<ItemDetail>>()
);
const mockUpdateItem = vi.hoisted(() =>
  vi.fn<(id: string, data: UpdateItemData) => Promise<ItemDetail | null>>()
);
const mockDeleteItem = vi.hoisted(() => vi.fn<(id: string) => Promise<boolean>>());
const mockGetItemTypes = vi.hoisted(() => vi.fn<() => Promise<ItemType[]>>());

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/features/items/lib/items", () => ({
  createItem: mockCreateItem,
  updateItem: mockUpdateItem,
  deleteItem: mockDeleteItem,
  getItemTypes: mockGetItemTypes,
}));

import {
  createItemAction,
  deleteItemAction,
  updateItemAction,
} from "@/features/items/actions";

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

const SNIPPETS_TYPE: ItemType = {
  id: "type-snippets",
  name: "Snippets",
  icon: "Code",
  color: "#3b82f6",
  isSystem: true,
  itemCount: 4,
};

const LINKS_TYPE: ItemType = {
  id: "type-links",
  name: "Links",
  icon: "Link",
  color: "#22c55e",
  isSystem: true,
  itemCount: 6,
};

const FILES_TYPE: ItemType = {
  id: "type-files",
  name: "Files",
  icon: "File",
  color: "#a855f7",
  isSystem: true,
  itemCount: 0,
};

function validCreateInput(
  overrides: Partial<CreateItemData> = {}
): CreateItemData {
  return {
    typeId: SNIPPETS_TYPE.id,
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
  mockGetItemTypes.mockResolvedValue([SNIPPETS_TYPE, LINKS_TYPE, FILES_TYPE]);
});

describe("createItemAction", () => {
  it("rejects when there is no session", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await createItemAction(validCreateInput());

    expect(result).toEqual({ success: false, error: "You must be signed in." });
    expect(mockCreateItem).not.toHaveBeenCalled();
  });

  it("rejects an empty title", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));

    const result = await createItemAction(validCreateInput({ title: "  " }));

    expect(result).toEqual({ success: false, error: "Title is required" });
    expect(mockCreateItem).not.toHaveBeenCalled();
  });

  it("rejects a type that isn't creatable", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));

    const result = await createItemAction(
      validCreateInput({ typeId: FILES_TYPE.id })
    );

    expect(result).toEqual({ success: false, error: "Select a valid item type." });
    expect(mockCreateItem).not.toHaveBeenCalled();
  });

  it("rejects an unknown type id", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));

    const result = await createItemAction(
      validCreateInput({ typeId: "not-a-real-type" })
    );

    expect(result).toEqual({ success: false, error: "Select a valid item type." });
    expect(mockCreateItem).not.toHaveBeenCalled();
  });

  it("requires a URL when the type is Links", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));

    const result = await createItemAction(
      validCreateInput({ typeId: LINKS_TYPE.id, url: null })
    );

    expect(result).toEqual({ success: false, error: "URL is required." });
    expect(mockCreateItem).not.toHaveBeenCalled();
  });

  it("delegates to createItem with the parsed data and returns the created item", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));
    const created = itemDetailFor({ title: "useDebounce" });
    mockCreateItem.mockResolvedValue(created);

    const result = await createItemAction(validCreateInput());

    expect(mockCreateItem).toHaveBeenCalledWith(validCreateInput());
    expect(result).toEqual({ success: true, data: created });
  });
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
