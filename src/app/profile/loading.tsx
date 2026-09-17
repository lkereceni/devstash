import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STAT_CARD_COUNT = 2;
const TYPE_ROW_COUNT = 7;

export default function Loading() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-48" />
      </header>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
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

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: TYPE_ROW_COUNT }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="size-4 shrink-0 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="flex flex-col gap-4">
        <Skeleton className="h-6 w-20" />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
