export type DefaultResultPayload = {
  uuid?: string;
  ELYSIA_SUMMARY?: string;
  _REF_ID?: string;
};

export type AggregationPayload = {
  num_items: number;
  collections: AggregationData[];
  _REF_ID?: string;
};

export type AggregationData = {
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

export type DocumentPayload = DefaultResultPayload & {
  title: string;
  author: string;
  date: string;
  content: string;
  category: string | string[];
  chunk_spans: ChunkSpan[];
  collection_name: string;
};

export type BarPayload = DefaultResultPayload & {
  title: string;
  description: string;
  x_axis_label: string;
  y_axis_label: string;
  data: {
    x_labels: string[] | number[];
    y_values: { [key: string]: number[] | string[] };
  };
};

export type HistogramPayload = DefaultResultPayload & {
  title: string;
  description: string;
  data: {
    [key: string]: {
      distribution: number[] | string[];
    };
  };
};

export type ScatterOrLinePayload = DefaultResultPayload & {
  title: string;
  description: string;
  x_axis_label: string;
  y_axis_label: string;
  data: ScatterOrLineDataPoints;
};

export type ScatterOrLineDataPoints = {
  x_axis: ScatterOrLineDataPoint[];
  y_axis: ScatterOrLineYAxisData[];
  normalize_y_axis: boolean;
};

export type ScatterOrLineYAxisData = {
  label: string;
  kind: "scatter" | "line";
  data_points: ScatterOrLineDataPoint[];
};

export type ScatterOrLineDataPoint = {
  value: number | string | Date;
  label: string | null;
};

export type ChartValue = {
  label: string;
  data: number[];
};

export type ChunkSpan = {
  start: number;
  end: number;
  uuid: string;
};

export type ProductPayload = DefaultResultPayload & {
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
};

export type TicketPayload = DefaultResultPayload & {
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

export type ThreadPayload = DefaultResultPayload & {
  conversation_id: string;
  messages: SingleMessagePayload[];
};

export type SingleMessagePayload = DefaultResultPayload & {
  relevant: boolean;
  conversation_id: number;
  message_id: string;
  author: string;
  content: string;
  timestamp: string;
};

export type CitationPreview = {
  type:
    | "text"
    | "ticket"
    | "message"
    | "conversation"
    | "product"
    | "ecommerce"
    | "epic_generic"
    | "boring_generic"
    | "aggregation"
    | "mapped"
    | "document";
  title: string;
  text: string;
  index: number;
  object: any | null;
};
