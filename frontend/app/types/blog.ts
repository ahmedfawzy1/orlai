import { PortableTextBlock } from 'next-sanity';

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  image?: {
    asset: { _ref: string };
  };
  bio?: any;
}

export interface BlogOverview {
  title: string;
  short_description: string;
  slug: string;
  image: {
    asset: {
      _ref: string;
    };
  };
  category?: Category;
  author?: Author;
  readTime?: string;
}

export interface BlogDetail extends BlogOverview {
  content: PortableTextBlock[];
}
