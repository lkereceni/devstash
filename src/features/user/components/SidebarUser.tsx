import { Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/user/lib/user";

/** Initials from the display name, falling back to the email for a nameless account. */
function getInitials(name: string | null, fallback: string): string {
  return (name?.trim() || fallback)
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SidebarUser() {
  const currentUser = getCurrentUser();

  return (
    <div className="flex items-center gap-2 rounded-md p-1 group-data-[collapsible=icon]:p-0">
      <Avatar>
        {currentUser.avatarUrl ? (
          <AvatarImage src={currentUser.avatarUrl} alt="" />
        ) : null}
        <AvatarFallback>
          {getInitials(currentUser.name, currentUser.email)}
        </AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 text-sm group-data-[collapsible=icon]:hidden">
        <span className="truncate font-medium">
          {currentUser.name ?? currentUser.email}
        </span>
        {currentUser.name ? (
          <span className="truncate text-xs text-sidebar-foreground/60">
            {currentUser.email}
          </span>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Settings"
        className="group-data-[collapsible=icon]:hidden"
      >
        <Settings aria-hidden />
      </Button>
    </div>
  );
}
