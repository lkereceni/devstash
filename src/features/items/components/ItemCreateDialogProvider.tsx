import type { ReactNode } from "react";

import { ItemCreateDialogClient } from "@/features/items/components/ItemCreateDialogClient";
import { isCreatableItemType } from "@/features/items/lib/item-types";
import { getItemTypes } from "@/features/items/lib/items";

/** Fetches the types the "New Item" dialog can create; the dialog itself is interactive. */
export async function ItemCreateDialogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const itemTypes = await getItemTypes();
  const creatableTypes = itemTypes.filter(isCreatableItemType);

  return (
    <ItemCreateDialogClient types={creatableTypes}>
      {children}
    </ItemCreateDialogClient>
  );
}
