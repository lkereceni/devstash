/** An item's type, as an item row needs it — no counts. */
export interface ItemTypeSummary {
  id: string;
  name: string;
  icon: string; // lucide icon name
  color: string | null;
}

/** An item type plus how many of the current user's items use it. */
export interface ItemType extends ItemTypeSummary {
  isSystem: boolean;
  itemCount: number;
}

/**
 * An item as the dashboard lists render it. Deliberately without the content
 * payload — item detail views will need their own, fuller shape.
 */
export interface ItemSummary {
  id: string;
  title: string;
  description: string | null;
  /** Embedded so a row can render its icon and accent without a second lookup. */
  type: ItemTypeSummary;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: string;
}

export interface ItemStats {
  total: number;
  favorites: number;
}
