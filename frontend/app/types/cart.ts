export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    priceRange: {
      minVariantPrice: number;
      maxVariantPrice: number;
    };
    images: string[];
  };
  variantId: string;
  color: {
    _id: string;
    name: string;
    hexCode: string;
  };
  size: {
    _id: string;
    name: string;
  };
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}
