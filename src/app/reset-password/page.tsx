import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;

  if (!token) {
    return (
      <AuthCard title="Reset password" description="This reset link is missing or invalid">
        <p className="text-center text-sm text-muted-foreground">
          Request a new one from the{" "}
          <Link href="/forgot-password" className="text-foreground underline underline-offset-4">
            forgot password
          </Link>{" "}
          page.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset password" description="Choose a new password for your account">
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
