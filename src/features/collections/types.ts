/** One item type present in a collection, with how many items it accounts for. */
export interface CollectionItemType {
  id: string;
  name: string;
  icon: string; // lucide icon name
  color: string | null;
  itemCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  /** Accent colour for the card border, derived from the collection's types. */
  color: string | null;
  isFavorite: boolean;
  itemCount: number;
  /** Distinct item types in the collection, most used first. */
  types: CollectionItemType[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionStats {
  total: number;
  favorites: number;
}
