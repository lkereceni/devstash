import { ItemTypesNavGroup } from "@/features/items/components/ItemTypesNavGroup";
import { getItemTypes } from "@/features/items/lib/items";

/** Fetches the sidebar's item types; the group itself is interactive. */
export async function ItemTypesNav() {
  const itemTypes = await getItemTypes();

  return <ItemTypesNavGroup itemTypes={itemTypes} />;
}
