"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GitHubIcon } from "@/components/auth/GitHubIcon";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  "email-not-verified": "Verify your email before signing in.",
  "invalid-token": "That verification link is invalid.",
  "expired-token": "That verification link has expired.",
  OAuthAccountNotLinked: "That email is already registered with a different sign-in method.",
};

function errorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? "Something went wrong signing in. Please try again.";
}

export function SignInForm({
  callbackUrl,
  initialError,
  verified,
}: {
  callbackUrl: string;
  initialError?: string;
  verified?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ? errorMessage(initialError) : null);
  const [needsVerification, setNeedsVerification] = useState(
    initialError === "email-not-verified" ||
      initialError === "invalid-token" ||
      initialError === "expired-token",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGitHubSubmitting, setIsGitHubSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (verified) {
      toast.success("Email verified", { description: "You can now sign in." });
    }
  }, [verified]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNeedsVerification(false);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      const code = result?.code ?? result?.error ?? "CredentialsSignin";
      setError(errorMessage(code));
      setNeedsVerification(code === "email-not-verified");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  async function handleResendVerification() {
    setIsResending(true);

    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setIsResending(false);
    toast.success("Verification email sent", {
      description: "Check your inbox for a new link.",
    });
  }

  async function handleGitHubSignIn() {
    setError(null);
    setIsGitHubSubmitting(true);

    try {
      await signIn("github", { callbackUrl });
    } catch {
      setError(errorMessage("OAuthSignin"));
      setIsGitHubSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant="outline"
        disabled={isGitHubSubmitting}
        onClick={handleGitHubSignIn}
      >
        <GitHubIcon className="size-4" />
        Sign in with GitHub
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        {needsVerification ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isResending || !email}
            onClick={handleResendVerification}
          >
            {isResending ? "Sending…" : "Resend verification email"}
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-foreground underline underline-offset-4">
          Register
        </Link>
      </p>
    </div>
  );
}
