import { notFound } from "next/navigation";

import { ItemCard, getItemsByType, getItemTypeBySlug } from "@/features/items";

export default async function ItemsByTypePage({
  params,
}: PageProps<"/items/[type]">) {
  const { type: slug } = await params;
  const type = await getItemTypeBySlug(slug);

  if (!type) {
    notFound();
  }

  const items = await getItemsByType(type.id);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">{type.name}</h1>
        <p className="text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </header>

      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No items in {type.name} yet.
        </p>
      )}
    </div>
  );
}
