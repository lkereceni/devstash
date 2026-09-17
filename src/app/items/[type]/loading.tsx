import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ITEM_CARD_COUNT = 6;

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-20" />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: ITEM_CARD_COUNT }).map((_, index) => (
          <Card key={index} className="border-l-4 border-l-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                <Skeleton className="size-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </CardTitle>
              <Skeleton className="h-3 w-16" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
