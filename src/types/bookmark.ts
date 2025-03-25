export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  categoryId: string;
  tags: string[];
  order: number;
  createdAt: number;
  updatedAt: number;
  icon?: string;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  description?: string;
  categoryId: string;
  tags: string[];
  icon?: string;
}
