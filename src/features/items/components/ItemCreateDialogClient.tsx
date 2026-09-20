"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ItemCreateDialog } from "@/features/items/components/ItemCreateDialog";
import type { ItemType } from "@/features/items/types";

interface ItemCreateDialogContextValue {
  openCreateDialog: () => void;
}

const ItemCreateDialogContext =
  createContext<ItemCreateDialogContextValue | null>(null);

/** Lets the top bar's "New Item" button open the create dialog. */
export function useItemCreateDialog(): ItemCreateDialogContextValue {
  const context = useContext(ItemCreateDialogContext);
  if (!context) {
    throw new Error(
      "useItemCreateDialog must be used within an ItemCreateDialogProvider"
    );
  }
  return context;
}

interface ItemCreateDialogClientProps {
  types: ItemType[];
  children: ReactNode;
}

/** Owns the dialog's open state so pages and the top bar stay server components. */
export function ItemCreateDialogClient({
  types,
  children,
}: ItemCreateDialogClientProps) {
  const [open, setOpen] = useState(false);

  const openCreateDialog = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ openCreateDialog }), [openCreateDialog]);

  return (
    <ItemCreateDialogContext.Provider value={value}>
      {children}
      <ItemCreateDialog types={types} open={open} onOpenChange={setOpen} />
    </ItemCreateDialogContext.Provider>
  );
}
