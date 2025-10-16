export interface Filter {
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

export interface Category {
  _id?: string;
  name: string;
  description: string;
  slug: string;
  __v?: number;
}

export interface Size {
  _id: string;
  name: string;
  __v: number;
}

export interface Color {
  _id: string;
  name: string;
  hexCode: string;
  __v: number;
}

export interface ColorsResponse {
  success: boolean;
  message: string;
  data: Color[];
  count: number;
}

export interface SizesResponse {
  success: boolean;
  message: string;
  data: Size[];
  count: number;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  count: number;
}
