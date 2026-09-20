"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ItemDrawer } from "@/features/items/components/ItemDrawer";

interface ItemDrawerContextValue {
  openItem: (id: string) => void;
}

const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null);

/** Lets an `ItemCard`/`ItemRow` anywhere under the shell open the drawer. */
export function useItemDrawer(): ItemDrawerContextValue {
  const context = useContext(ItemDrawerContext);
  if (!context) {
    throw new Error("useItemDrawer must be used within an ItemDrawerProvider");
  }
  return context;
}

/**
 * Owns the drawer's open/selected-item state so pages stay server components.
 * Wraps the app shell once; item lists just call `useItemDrawer().openItem(id)`.
 */
export function ItemDrawerProvider({ children }: { children: ReactNode }) {
  const [itemId, setItemId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const openItem = useCallback((id: string) => {
    setItemId(id);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openItem }), [openItem]);

  return (
    <ItemDrawerContext.Provider value={value}>
      {children}
      <ItemDrawer itemId={itemId} open={open} onOpenChange={setOpen} />
    </ItemDrawerContext.Provider>
  );
}
