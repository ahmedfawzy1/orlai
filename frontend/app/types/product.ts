export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  style: string;
  store: string;
  size: string;
  inventory: number;
  color: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  userId: number;
  slug: string;
  averageRating: number;
  createdAt: string;
}

export interface SearchQuery {
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  priceRange?: [number, number];
  searchQuery?: string;
}
