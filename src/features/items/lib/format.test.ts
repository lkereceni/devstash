import { describe, expect, it } from "vitest";

import { formatShortDate } from "@/features/items/lib/format";

describe("formatShortDate", () => {
  it("formats an ISO date as a UTC month and day", () => {
    expect(formatShortDate("2026-01-15T00:00:00.000Z")).toBe("Jan 15");
  });

  it("stays on the UTC day even close to a local day boundary", () => {
    expect(formatShortDate("2026-01-01T23:30:00.000Z")).toBe("Jan 1");
  });
});
