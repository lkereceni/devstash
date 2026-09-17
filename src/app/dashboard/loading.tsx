import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STAT_CARD_COUNT = 4;
const COLLECTION_CARD_COUNT = 3;
const RECENT_ITEM_COUNT = 5;

export default function Loading() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-64" />
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: STAT_CARD_COUNT }).map((_, index) => (
          <Card key={index}>
            <CardContent className="flex items-center gap-3">
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="ml-auto h-4 w-14" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: COLLECTION_CARD_COUNT }).map((_, index) => (
            <Card key={index} className="border-l-4 border-l-border">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
                <Skeleton className="h-3 w-16" />
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="size-4 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="ml-auto h-4 w-14" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: RECENT_ITEM_COUNT }).map((_, index) => (
            <Card
              key={index}
              className="flex-row items-start gap-3 border-l-4 border-l-border px-4"
            >
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
              <Skeleton className="h-3.5 w-10 shrink-0" />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
