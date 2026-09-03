import { AuthCard } from "@/components/auth/AuthCard";
import { SignInForm } from "@/components/auth/SignInForm";

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : "/dashboard";
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <AuthCard title="Sign in" description="Sign in to your DevStash account">
      <SignInForm callbackUrl={callbackUrl} initialError={error} />
    </AuthCard>
  );
}
