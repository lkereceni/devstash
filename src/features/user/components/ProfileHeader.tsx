import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/features/user/components/UserAvatar";
import { formatJoinDate } from "@/features/user/lib/format";
import type { UserProfile } from "@/features/user/types";

export function ProfileHeader({ user }: { user: UserProfile }) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-4">
        <UserAvatar name={user.name} email={user.email} image={user.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-xl font-semibold">{user.name ?? user.email}</p>
            {user.isPro ? <Badge variant="outline">PRO</Badge> : null}
          </div>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays aria-hidden className="size-4" />
          Joined {formatJoinDate(user.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}
