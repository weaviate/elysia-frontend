export type AggregationPayload = {
  [key: string]: AggregationCollection;
};

export type AggregationCollection = {
  [key: string]: AggregationField;
};

export type AggregationField = {
  type: "text" | "number";
  values: AggregationValue[];
  groups?: { [key: string]: AggregationCollection };
};

export type AggregationValue = {
  value: string | number;
  field: string | null;
  aggregation: "count" | "sum" | "avg" | "minimum" | "maximum" | "mean";
};

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

export type ProductPayload = {
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

export type TicketPayload = {
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

export type ThreadPayload = {
  conversation_id: string;
  summary?: string;
  messages: SingleMessagePayload[];
};

export type SingleMessagePayload = {
  uuid: string;
  summary?: string;
  relevant: boolean;
  conversation_id: number;
  message_id: string;
  author: string;
  content: string;
  timestamp: string;
};
