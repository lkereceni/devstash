"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/features/user/components/UserAvatar";
import type { User } from "@/features/user/types";

export function SidebarUserMenu({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2 rounded-md p-1 group-data-[collapsible=icon]:p-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <UserAvatar name={user.name} email={user.email} image={user.avatarUrl} />
            <div className="grid min-w-0 flex-1 text-sm group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{user.name ?? user.email}</span>
              {user.name ? (
                <span className="truncate text-xs text-sidebar-foreground/60">
                  {user.email}
                </span>
              ) : null}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-56">
          <DropdownMenuItem variant="destructive" onSelect={() => signOut({ callbackUrl: "/sign-in" })}>
            <LogOut aria-hidden />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        asChild
        variant="ghost"
        size="icon-sm"
        aria-label="Profile"
        className="group-data-[collapsible=icon]:hidden"
      >
        <Link href="/profile">
          <Settings aria-hidden />
        </Link>
      </Button>
    </div>
  );
}
