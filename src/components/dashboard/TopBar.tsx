import { FolderPlus, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
      <SidebarTrigger className="-ml-1.5" />
      <Separator orientation="vertical" className="mr-1 h-6" />
      <div className="relative min-w-0 flex-1 md:max-w-md">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search items..."
          aria-label="Search items"
          className="h-9 pl-9"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 text-[0.7rem] text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Button variant="outline" size="lg" aria-label="New Collection">
          <FolderPlus aria-hidden />
          <span className="hidden md:inline">New Collection</span>
        </Button>
        <Button size="lg" aria-label="New Item">
          <Plus aria-hidden />
          <span className="hidden md:inline">New Item</span>
        </Button>
      </div>
    </header>
  );
}
