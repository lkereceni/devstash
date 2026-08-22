import { FolderPlus, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b px-6">
      <div className="relative w-full max-w-md">
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
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="lg">
          <FolderPlus aria-hidden />
          New Collection
        </Button>
        <Button size="lg">
          <Plus aria-hidden />
          New Item
        </Button>
      </div>
    </header>
  );
}
