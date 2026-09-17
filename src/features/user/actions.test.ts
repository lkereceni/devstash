import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

type ChangePasswordResult = { success: true } | { success: false; error: string };

// `auth`'s real type is NextAuth's overloaded function (plain call, or used
// as middleware), which `vi.mocked()` can't infer cleanly — so the mocks are
// declared with their own simple signatures instead of derived from it.
const mockAuth = vi.hoisted(() => vi.fn<() => Promise<Session | null>>());
const mockChangePassword = vi.hoisted(() =>
  vi.fn<
    (userId: string, currentPassword: string, newPassword: string) => Promise<ChangePasswordResult>
  >()
);
const mockDeleteAccount = vi.hoisted(() => vi.fn<(userId: string) => Promise<void>>());

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/features/user/lib/user", () => ({
  changePassword: mockChangePassword,
  deleteAccount: mockDeleteAccount,
}));

import { changePasswordAction, deleteAccountAction } from "@/features/user/actions";

function sessionFor(userId: string): Session {
  return { user: { id: userId }, expires: "2099-01-01T00:00:00.000Z" };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("changePasswordAction", () => {
  it("rejects when there is no session", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await changePasswordAction({
      currentPassword: "old-password",
      newPassword: "newpassword1",
      confirmPassword: "newpassword1",
    });

    expect(result).toEqual({ success: false, error: "You must be signed in." });
    expect(mockChangePassword).not.toHaveBeenCalled();
  });

  it("rejects a new password shorter than 8 characters", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));

    const result = await changePasswordAction({
      currentPassword: "old-password",
      newPassword: "short",
      confirmPassword: "short",
    });

    expect(result.success).toBe(false);
    expect(mockChangePassword).not.toHaveBeenCalled();
  });

  it("rejects when the new and confirm passwords don't match", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));

    const result = await changePasswordAction({
      currentPassword: "old-password",
      newPassword: "newpassword1",
      confirmPassword: "different1",
    });

    expect(result).toEqual({ success: false, error: "Passwords do not match" });
    expect(mockChangePassword).not.toHaveBeenCalled();
  });

  it("delegates to changePassword with the session's user id", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));
    mockChangePassword.mockResolvedValue({ success: true });

    const result = await changePasswordAction({
      currentPassword: "old-password",
      newPassword: "newpassword1",
      confirmPassword: "newpassword1",
    });

    expect(mockChangePassword).toHaveBeenCalledWith("user-1", "old-password", "newpassword1");
    expect(result).toEqual({ success: true });
  });

  it("passes through a failure from changePassword", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));
    mockChangePassword.mockResolvedValue({
      success: false,
      error: "Current password is incorrect.",
    });

    const result = await changePasswordAction({
      currentPassword: "wrong-password",
      newPassword: "newpassword1",
      confirmPassword: "newpassword1",
    });

    expect(result).toEqual({ success: false, error: "Current password is incorrect." });
  });
});

describe("deleteAccountAction", () => {
  it("rejects when there is no session", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await deleteAccountAction();

    expect(result).toEqual({ success: false, error: "You must be signed in." });
    expect(mockDeleteAccount).not.toHaveBeenCalled();
  });

  it("deletes the signed-in user's account", async () => {
    mockAuth.mockResolvedValue(sessionFor("user-1"));

    const result = await deleteAccountAction();

    expect(mockDeleteAccount).toHaveBeenCalledWith("user-1");
    expect(result).toEqual({ success: true });
  });
});
