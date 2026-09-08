import { redirect } from "next/navigation";

import {
  ChangePasswordForm,
  DeleteAccountCard,
  ProfileHeader,
  ProfileStats,
  getUserProfile,
} from "@/features/user";

export default async function ProfilePage() {
  const user = await getUserProfile();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">Your account and usage</p>
      </header>

      <ProfileHeader user={user} />
      <ProfileStats />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Account</h2>
        {user.hasPassword ? <ChangePasswordForm /> : null}
        <DeleteAccountCard />
      </section>
    </div>
  );
}
