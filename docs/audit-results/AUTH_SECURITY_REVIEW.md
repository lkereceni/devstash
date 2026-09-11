# Authentication Security Audit

**Last Audit Date**: 2026-09-11
**Auditor**: Auth Security Agent

## Executive Summary

The custom auth code (Credentials provider, registration, email verification, password reset, profile management) is generally well-built: passwords are hashed with bcrypt at 12 rounds, tokens are generated with `crypto.randomBytes(32)`, verification/reset tokens are deleted before their expiry is checked (true single-use), and the enumeration-sensitive endpoints (`forgot-password`, `resend-verification`) correctly return a generic response regardless of account state. However, three of the links that carry security-sensitive tokens (`register`, `forgot-password`, `resend-verification`) build their absolute URL from the request's own `Host` header with no allowlist or configured origin, which is a classic password-reset-poisoning primitive. There is also no rate limiting anywhere in the auth surface, and a password change/reset does not invalidate any session issued before it. Fix the Host-header trust issue first — it is the one finding that leads directly to account takeover.

## Findings

### Critical Issues

#### Password Reset / Verification Link Poisoning via Unvalidated Host Header

**Severity**: Critical
**File**: `src/app/api/auth/forgot-password/route.ts`
**Line(s)**: 54-55 (also `src/app/api/auth/register/route.ts:67-68` and `src/app/api/auth/resend-verification/route.ts:53-54`, same pattern)

**Vulnerable Code**:
```typescript
const resetUrl = new URL("/reset-password", request.url);
resetUrl.searchParams.set("token", token);
```

**Problem**: `request.url` in a Next.js Route Handler is built from the incoming request's `Host` header (there is no `AUTH_URL`/`NEXT_PUBLIC_APP_URL`/site-origin env var anywhere in `.env.example` or the codebase that these routes read instead). A client can set an arbitrary `Host` header on a direct HTTP request, so the app will happily mint a reset/verification link that points at an attacker-controlled domain while still emailing it to the real account's inbox.

**Attack Scenario**: An attacker sends `POST /api/auth/forgot-password` with `{"email":"victim@example.com"}` and a spoofed header `Host: attacker.example`. The victim's real inbox receives "Reset your DevStash password" with a link like `https://attacker.example/reset-password?token=<realtoken>`. If the victim clicks it (a normal reaction to what looks like their own app's email), the token is delivered to a page the attacker controls, which can immediately replay it against the real app's `POST /api/auth/reset-password` to take over the account — no MFA or second factor exists to stop this. The same primitive applies to `register`/`resend-verification`'s verify-email links, though there the attacker already controls the account being verified so the impact is lower. This is the exact mechanism documented as "password reset poisoning" (PortSwigger Web Security Academy, OWASP Host Header Injection testing guide).

**Fix**: Never derive a security-sensitive absolute URL from the request. Use a server-only, explicitly configured origin instead:
```typescript
// src/lib/site-url.ts
export function getSiteUrl(): string {
  const url = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (!url) throw new Error("AUTH_URL (or NEXT_PUBLIC_APP_URL) must be set");
  return url;
}
```
```typescript
// forgot-password/route.ts, register/route.ts, resend-verification/route.ts
import { getSiteUrl } from "@/lib/site-url";

const resetUrl = new URL("/reset-password", getSiteUrl());
resetUrl.searchParams.set("token", token);
```
Add `AUTH_URL` (NextAuth v5 already recognizes this variable for its own redirects) to `.env.example` and set it in every deployment environment. If a dynamic host is ever genuinely needed, validate it against an explicit allowlist rather than trusting it outright.

### High Severity

#### No Rate Limiting on Any Auth Endpoint

**Severity**: High
**File**: `src/auth.ts` (Credentials `authorize`), `src/app/api/auth/register/route.ts`, `src/app/api/auth/forgot-password/route.ts`, `src/app/api/auth/resend-verification/route.ts`

**Problem**: None of the credentials sign-in path, registration, password-reset request, or verification-resend endpoints enforce any per-IP or per-account throttling. A `grep` for `rate.?limit`/`Ratelimit` across the codebase returns nothing outside this audit's own files.

**Attack Scenario**: An attacker can brute-force a target's password against `signIn("credentials", ...)` (bcrypt slows each attempt but imposes no ceiling on attempt count), flood `resend-verification`/`forgot-password` to spam a victim's inbox ("email bombing"), or script mass account creation through `register`. None of these require bypassing anything NextAuth itself provides (CSRF/cookies/OAuth state are out of scope here — this is purely the absence of custom throttling).

**Fix**: Add IP- and/or account-keyed rate limiting in front of these four routes, e.g. with Upstash `@upstash/ratelimit` (works well on Vercel edge/serverless) or a simple Postgres-backed counter if avoiding a new dependency:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await limiter.limit(`forgot-password:${ip}`);
  if (!success) {
    return NextResponse.json({ success: true }, { status: 200 }); // stay generic
  }
  // ...existing logic
}
```
For the Credentials `authorize` callback specifically, key the limiter by the submitted email as well as IP, since a distributed brute force can rotate IPs.

#### Password Change and Reset Do Not Invalidate Existing Sessions

**Severity**: High
**File**: `src/features/user/lib/user.ts` (`changePassword`, lines 61-86); `src/app/api/auth/reset-password/route.ts` (lines 64-70)

**Vulnerable Code**:
```typescript
// user.ts - changePassword
await prisma.user.update({
  where: { id: userId },
  data: { password: hashedPassword },
});
return { success: true };
```
```typescript
// reset-password/route.ts
await prisma.user.update({
  where: { email },
  data: { password: hashedPassword },
});
```

**Problem**: The app uses `session: { strategy: "jwt" }` (`src/auth.ts:59`) and the `jwt` callback only ever copies `user.id` onto the token at initial sign-in (`src/auth.ts:61-66`) — it never re-checks the database on subsequent requests. Neither `changePassword` nor the reset-password flow rotates or invalidates anything (no `tokenVersion`/`passwordChangedAt` field exists on `User` to compare against). A JWT issued before the change stays fully valid, under NextAuth's default `session.maxAge` (30 days), until it naturally expires.

**Attack Scenario**: If an attacker has stolen a session cookie (via a leaked device, XSS in some unrelated part of the app, etc.) and the legitimate user notices and "secures" the account by changing their password or using "Forgot password," the attacker's already-issued JWT keeps working — the very action meant to lock them out does not.

**Fix**: Add a `passwordChangedAt` column to `User`, stamp it in both `changePassword` and the reset-password route, and check it in the `jwt` callback against the token's issue time (`token.iat`), forcing re-authentication if the password changed after the token was minted:
```prisma
model User {
  // ...
  passwordChangedAt DateTime? @map("password_changed_at")
}
```
```typescript
// src/auth.ts
async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    return token;
  }
  if (typeof token.id === "string" && typeof token.iat === "number") {
    const dbUser = await prisma.user.findUnique({
      where: { id: token.id },
      select: { passwordChangedAt: true },
    });
    if (dbUser?.passwordChangedAt && dbUser.passwordChangedAt.getTime() / 1000 > token.iat) {
      return null; // forces sign-out on next session read
    }
  }
  return token;
},
```
This does add a DB read per request; an acceptable alternative is switching `changePassword`/`deleteAccount`-adjacent security actions to `session: { strategy: "database" }` so sessions can be revoked server-side directly — a larger change, so the token-timestamp check above is the more surgical fix.

### Medium Severity

#### No Maximum Password Length

**Severity**: Medium
**File**: `src/app/api/auth/register/route.ts:17` (`password: z.string().min(8)`), `src/app/api/auth/reset-password/route.ts:16`, `src/features/user/actions.ts:16` (`newPassword: z.string().min(8)`), `src/auth.ts:14` (`password: z.string().min(1)`)

**Problem**: None of the four zod schemas that validate a password set an upper bound. `bcryptjs` (the pure-JS bcrypt used here, per `package.json`) silently truncates any input beyond 72 bytes before hashing, and — separately — hashing an attacker-supplied multi-megabyte string is CPU work the server does before rejecting anything, i.e. an unauthenticated cost-amplification vector on `register` and the Credentials `authorize` callback in particular (both take arbitrary unauthenticated request bodies).

**Attack Scenario**: A scripted client posts a password field containing several megabytes of data to `/api/auth/register` or through `signIn("credentials", ...)` repeatedly; each request forces a full bcrypt hash/compare over the oversized input before failing, burning CPU disproportionate to the request's size — no verified account or valid session is needed.

**Fix**: Cap password length in every schema that accepts one, matching bcrypt's effective limit:
```typescript
password: z.string().min(8).max(72),
```
Apply the same `.max(72)` to `confirmPassword`, `newPassword`, and the Credentials provider's `credentialsSchema.password` (there `.max(72)` is enough since login only ever compares against an already-hashed value, but it still stops the oversized-input cost).

#### Email Enumeration on Registration

**Severity**: Medium
**File**: `src/app/api/auth/register/route.ts:38-44`

**Vulnerable Code**:
```typescript
const existingUser = await prisma.user.findUnique({ where: { email } });
if (existingUser) {
  return NextResponse.json(
    { success: false, error: "A user with this email already exists" },
    { status: 409 },
  );
}
```

**Problem**: Unlike `forgot-password` and `resend-verification` (both deliberately generic, per their own code comments), `register` confirms outright whether an email is already registered. This is inconsistent with the enumeration-resistance the rest of the flow was clearly designed around.

**Attack Scenario**: An attacker scripts a list of candidate emails against `/api/auth/register` to build a set of confirmed DevStash accounts, e.g. as a precursor to a targeted credential-stuffing or phishing run.

**Fix**: This is a real but low-effort-to-exploit/low-severity-in-isolation issue and a judgment call, since usable registration UX conventionally needs to tell a user "that email is taken." If enumeration resistance is a priority, the standard mitigation is to still create nothing and respond with the same generic "check your email to continue" message either way, then separately send the existing account holder a "someone tried to register with your email" notice instead of a verification link:
```typescript
if (existingUser) {
  return NextResponse.json(
    { success: true, data: { email } }, // no id/name — nothing was created
    { status: 200 },
  );
}
```
At minimum, keep this deliberate rather than incidental, and document the trade-off next to `resend-verification`'s comment explaining the opposite choice.

### Low Severity

#### Unhandled JSON Parse Failure on Every Auth POST Route

**Severity**: Low
**File**: `src/app/api/auth/register/route.ts:26`, `forgot-password/route.ts:21`, `reset-password/route.ts:25`, `resend-verification/route.ts:16`

**Problem**: `await request.json()` is not wrapped in a `try/catch`. A malformed body (not valid JSON) throws, which Next.js turns into an unhandled 500. This isn't an information-disclosure risk in production (Next.js does not leak a stack trace to the client for an uncaught route-handler error), but it's an easy, cheap hardening fix and the current behavior is inconsistent with every other error path in these same files, which all return a clean `{ success: false, error }` JSON body.

**Fix**:
```typescript
let body: unknown;
try {
  body = await request.json();
} catch {
  return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
}
const parsed = registerSchema.safeParse(body);
```

## Passed Checks

- Passwords hashed with bcrypt at 12 rounds (`register/route.ts`, `reset-password/route.ts`, `user.ts`'s `changePassword`) — no plaintext password is ever persisted, logged, or returned to the client.
- Credentials `authorize` in `src/auth.ts` returns only `{id, name, email, image}` on success — the password hash never reaches the JWT or the client.
- Email-verification and password-reset tokens are generated with `crypto.randomBytes(32)` (256 bits of entropy) — not `Math.random()` or a predictable source.
- Both token flows delete the token *before* checking its expiry (`verify-email/route.ts`, `reset-password/route.ts`), so a replayed link always reads as invalid rather than being reusable — true single-use enforcement.
- Password-reset tokens are correctly namespaced (`password-reset:<email>` identifier prefix) so they cannot be confused with or delete an unrelated email-verification token sharing the same `VerificationToken` table, and `reset-password` explicitly rejects any token lacking that prefix.
- `forgot-password` and `resend-verification` both return an identical generic response regardless of whether the account exists, is already verified, or the feature flag is off — no email enumeration on either endpoint.
- Credentials `authorize` checks the password (`bcrypt.compare`) *before* checking `emailVerified`, so a wrong-password guess never discloses whether the target account is verified.
- Dev-only console logging of verification/reset links is correctly gated on `process.env.NODE_ENV !== "production"` — tokens are never written to logs in production.
- `changePasswordAction`/`deleteAccountAction` (`src/features/user/actions.ts`) trust only `session.user.id` from `auth()`, never a client-supplied user id, and `changePassword` independently re-verifies the current password with `bcrypt.compare` before allowing a change.
- `deleteAccount` relies on `onDelete: Cascade` from `User` to `Item`/`Collection`/`Tag`/`Account`/`Session` in `prisma/schema.prisma`, so account deletion cannot leave orphaned rows.
- All Prisma queries in the audited files use the query builder with parameterized `where` clauses — no raw SQL, no injection surface.
- `src/proxy.ts` correctly gates `/dashboard` and `/profile` behind `isLoggedIn`, redirecting to `/sign-in` with the original URL preserved as `callbackUrl`.
- GitHub-only accounts (`user.password === null`) safely fail Credentials sign-in (`user?.password` guard) and are excluded from `ChangePasswordForm` via `hasPassword`, so there's no path to "changing" a password that doesn't exist.

## Recommendations Summary

1. **Critical** — Stop building `resetUrl`/`verifyUrl` from `request.url`; introduce a configured `AUTH_URL`/site-origin constant and use it in `register`, `forgot-password`, and `resend-verification`. This is the one fix that closes an account-takeover path.
2. **High** — Add rate limiting (IP- and/or email-keyed) to the Credentials `authorize` callback, `register`, `forgot-password`, and `resend-verification`.
3. **High** — Give `User` a `passwordChangedAt` timestamp and check it in the `jwt` callback so a password change/reset invalidates JWTs minted before it.
4. **Medium** — Add `.max(72)` to every password-accepting zod schema (`register`, `reset-password`, `changePassword` action, and the Credentials `authorize` schema).
5. **Medium** — Decide deliberately whether `register`'s "account already exists" response is an acceptable trade-off, or switch it to the same generic-response pattern already used by `forgot-password`/`resend-verification`.
6. **Low** — Wrap `request.json()` in `try/catch` across all four auth POST routes for a clean 400 instead of an unhandled 500.
