export interface Product {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
    description: string;
    slug: string;
    __v: number;
  };
  availableForSale: boolean;
  images: string[];
  variants: {
    _id: string;
    color: {
      _id: string;
      name: string;
      hexCode: string;
      __v: number;
    } | null;
    size: {
      _id: string;
      name: string;
      __v: number;
    };
    stock: number;
  }[];
  priceRange: {
    maxVariantPrice: number;
    minVariantPrice: number;
    _id: string;
  };
  inventory: number;
  averageRating: number;
  slug: string;
  reviews: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id?: string;
}

export interface SearchQuery {
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  priceRange?: [number, number];
  searchQuery?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationInfo;
  count?: number;
}

export interface PaginationInfo {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

// Product API responses
export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: PaginationInfo;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface BestSellersResponse {
  success: boolean;
  message: string;
  data: Product[];
  count: number;
}
