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
