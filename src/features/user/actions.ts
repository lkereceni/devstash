"use server";

import { z } from "zod";

import { auth } from "@/auth";
import { changePassword, deleteAccount } from "@/features/user/lib/user";

interface ActionResult {
  success: boolean;
  error?: string;
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  return changePassword(session.user.id, parsed.data.currentPassword, parsed.data.newPassword);
}

export async function deleteAccountAction(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  await deleteAccount(session.user.id);
  return { success: true };
}
