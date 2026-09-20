import { describe, expect, it } from "vitest";

import {
  getItemTypeHref,
  isContentEditableItemType,
  isLanguageEditableItemType,
  isProItemType,
  isUrlEditableItemType,
  matchesItemTypeSlug,
} from "@/features/items/lib/item-types";
import type { ItemTypeSummary } from "@/features/items/types";

function makeType(overrides: Partial<ItemTypeSummary> = {}): ItemTypeSummary {
  return { id: "type-1", name: "Snippets", icon: "Code", color: "#3b82f6", ...overrides };
}

describe("getItemTypeHref", () => {
  it("slugifies a simple name", () => {
    expect(getItemTypeHref(makeType({ name: "Snippets" }))).toBe("/items/snippets");
  });

  it("collapses non-alphanumeric runs into a single dash", () => {
    expect(getItemTypeHref(makeType({ name: "AI / Prompts!!" }))).toBe("/items/ai-prompts");
  });

  it("trims leading and trailing dashes", () => {
    expect(getItemTypeHref(makeType({ name: "  Notes  " }))).toBe("/items/notes");
  });
});

describe("matchesItemTypeSlug", () => {
  it("matches when the slug derives from the type's name", () => {
    expect(matchesItemTypeSlug(makeType({ name: "Commands" }), "commands")).toBe(true);
  });

  it("does not match a different type's slug", () => {
    expect(matchesItemTypeSlug(makeType({ name: "Commands" }), "snippets")).toBe(false);
  });
});

describe("isProItemType", () => {
  it("flags the Pro-gated built-in types", () => {
    expect(isProItemType(makeType({ name: "Files" }))).toBe(true);
    expect(isProItemType(makeType({ name: "Images" }))).toBe(true);
  });

  it("does not flag a non-Pro type", () => {
    expect(isProItemType(makeType({ name: "Snippets" }))).toBe(false);
  });
});

describe("isContentEditableItemType", () => {
  it("flags the text-content types", () => {
    expect(isContentEditableItemType(makeType({ name: "Snippets" }))).toBe(true);
    expect(isContentEditableItemType(makeType({ name: "Prompts" }))).toBe(true);
    expect(isContentEditableItemType(makeType({ name: "Commands" }))).toBe(true);
    expect(isContentEditableItemType(makeType({ name: "Notes" }))).toBe(true);
  });

  it("does not flag a type with no content field", () => {
    expect(isContentEditableItemType(makeType({ name: "Links" }))).toBe(false);
  });
});

describe("isLanguageEditableItemType", () => {
  it("flags the types with a language field", () => {
    expect(isLanguageEditableItemType(makeType({ name: "Snippets" }))).toBe(true);
    expect(isLanguageEditableItemType(makeType({ name: "Commands" }))).toBe(true);
  });

  it("does not flag a type with no language field", () => {
    expect(isLanguageEditableItemType(makeType({ name: "Notes" }))).toBe(false);
  });
});

describe("isUrlEditableItemType", () => {
  it("flags Links", () => {
    expect(isUrlEditableItemType(makeType({ name: "Links" }))).toBe(true);
  });

  it("does not flag a type with no URL field", () => {
    expect(isUrlEditableItemType(makeType({ name: "Snippets" }))).toBe(false);
  });
});
