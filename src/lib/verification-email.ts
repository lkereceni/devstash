import "server-only";

import { resend } from "@/lib/resend";

// resend.dev's shared testing sender — swap for a verified domain address
// once one is configured on the Resend account.
const FROM_ADDRESS = "DevStash <onboarding@resend.dev>";

export async function sendVerificationEmail(email: string, verifyUrl: string): Promise<void> {
  // Without a verified sending domain, Resend's sandbox only delivers to the
  // account's own address — every other recipient 422s. Logging the link
  // keeps registration testable for other accounts without one.
  if (process.env.NODE_ENV !== "production") {
    console.log(`[verification email] ${email} -> ${verifyUrl}`);
  }

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Verify your DevStash email",
    html: `
      <p>Welcome to DevStash — confirm your email to finish setting up your account.</p>
      <p><a href="${verifyUrl}">Verify your email</a></p>
      <p>This link expires in 24 hours. If you didn't create a DevStash account, you can ignore this email.</p>
    `,
  });
}
