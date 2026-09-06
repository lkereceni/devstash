import "server-only";

import { Resend } from "resend";

function createResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. Copy .env.example to .env and add your Resend API key.");
  }

  return new Resend(apiKey);
}

// Next.js re-evaluates modules on every hot reload in dev. Without stashing the
// client on globalThis each reload would construct a new client needlessly.
const globalForResend = globalThis as unknown as {
  resend?: Resend;
};

export const resend = globalForResend.resend ?? createResendClient();

if (process.env.NODE_ENV !== "production") {
  globalForResend.resend = resend;
}
