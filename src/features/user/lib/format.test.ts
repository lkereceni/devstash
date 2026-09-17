import { describe, expect, it } from "vitest";

import { formatJoinDate } from "@/features/user/lib/format";

describe("formatJoinDate", () => {
  it("formats an ISO date as a full UTC date", () => {
    expect(formatJoinDate("2026-08-23T12:00:00.000Z")).toBe("August 23, 2026");
  });

  it("stays on the UTC day even close to a local day boundary", () => {
    expect(formatJoinDate("2026-08-23T23:45:00.000Z")).toBe("August 23, 2026");
  });
});
