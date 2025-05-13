export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  inventory: number;
  availableForSale: boolean;
  images: string[];
  variants: {
    _id: string;
    color: string;
    size: string;
    stock: number;
  }[];
  priceRange: {
    maxVariantPrice: number;
    minVariantPrice: number;
  };
  averageRating: number;
  slug: string;
  reviews: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchQuery {
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  priceRange?: [number, number];
  searchQuery?: string;
}
