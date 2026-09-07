import "server-only";

import { resend } from "@/lib/resend";

// resend.dev's shared testing sender — swap for a verified domain address
// once one is configured on the Resend account.
const FROM_ADDRESS = "DevStash <onboarding@resend.dev>";

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  // Without a verified sending domain, Resend's sandbox only delivers to the
  // account's own address — every other recipient 422s. Logging the link
  // keeps the flow testable for other accounts without one.
  if (process.env.NODE_ENV !== "production") {
    console.log(`[password reset email] ${email} -> ${resetUrl}`);
  }

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Reset your DevStash password",
    html: `
      <p>We received a request to reset your DevStash password.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    `,
  });
}
