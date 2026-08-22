export interface ItemType {
  id: string;
  name: string;
  icon: string; // lucide icon name
  color: string;
  isSystem: boolean;
  itemCount: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  contentType: "text" | "file";
  content: string | null;
  language: string | null;
  url: string | null;
  fileName: string | null;
  fileSize: number | null;
  typeId: string;
  collectionId: string | null;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
