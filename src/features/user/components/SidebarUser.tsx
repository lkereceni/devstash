import { Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/user/lib/user";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
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
        <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 text-sm group-data-[collapsible=icon]:hidden">
        <span className="truncate font-medium">{currentUser.name}</span>
        <span className="truncate text-xs text-sidebar-foreground/60">
          {currentUser.email}
        </span>
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
