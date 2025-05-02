export type DocumentPayload = {
    uuid?: string;
    summary?: string;
    title: string;
    author: string;
    date: string;
    content: string;
    category: string | string[];
    chunk_spans: ChunkSpan[];
    collection_name: string;
  };

export type ChunkSpan = {
  start: number;
  end: number;
  uuid: string;
};

export type Product = {
  subcategory: string;
  description: string;
  reviews: string[] | number;
  collection: string;
  tags: string[];
  sizes: string[];
  product_id: string;
  image: string;
  url: string;
  rating: number;
  price: number;
  category: string;
  colors: string[];
  brand: string;
  name: string;
  id: string;
  uuid: string;
  summary?: string;
};

export type Ticket = {
  uuid: string;
  summary?: string;
  updated_at: string;
  title: string;
  subtitle: string;
  content: string;
  created_at: string;
  author: string;
  url: string;
  status: string;
  id: string;
  tags: string[];
  comments: number | string[];
};