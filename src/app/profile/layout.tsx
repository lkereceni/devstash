import { AppShell } from "@/components/layout/AppShell";

export default function ProfileLayout({ children }: LayoutProps<"/profile">) {
  return <AppShell>{children}</AppShell>;
}
