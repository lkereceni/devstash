import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  icon?: LucideIcon;
  action?: { label: string; href: string };
  children: ReactNode;
}

export function DashboardSection({
  title,
  icon: Icon,
  action,
  children,
}: DashboardSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {Icon ? (
          <Icon aria-hidden className="size-4 text-muted-foreground" />
        ) : null}
        <h2 className="text-lg font-semibold">{title}</h2>
        {action ? (
          <Link
            href={action.href}
            className="ml-auto text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
