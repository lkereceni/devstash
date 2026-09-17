import { AppShell } from "@/components/layout/AppShell";

export default function ItemsByTypeLayout({
  children,
}: LayoutProps<"/items/[type]">) {
  return <AppShell>{children}</AppShell>;
}
