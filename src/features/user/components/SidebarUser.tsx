import { SidebarUserMenu } from "@/features/user/components/SidebarUserMenu";
import { getCurrentUser } from "@/features/user/lib/user";

export async function SidebarUser() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <SidebarUserMenu user={user} />;
}
