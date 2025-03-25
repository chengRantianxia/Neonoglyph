export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  icon?: string;
}
