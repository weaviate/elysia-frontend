import { TreeUpdatePayload } from "@/app/components/types";
import {
  TicketPayload,
  SingleMessagePayload,
  ThreadPayload,
  ProductPayload,
  AggregationPayload,
  DocumentPayload,
} from "@/app/types/displays";

export type Message = {
  type:
    | "result"
    | "error"
    | "tree_timeout_error"
    | "rate_limit_error"
    | "authentication_error"
    | "text"
    | "User"
    | "decision"
    | "status"
    | "completed"
    | "warning"
    | "tree_update"
    | "training_update"
    | "suggestion";
  conversation_id: string;
  id: string;
  user_id: string;
  query_id: string;
  payload:
    | ResultPayload
    | TextPayload
    | ErrorPayload
    | RateLimitPayload
    | ResponsePayload
    | TreeUpdatePayload
    | SuggestionPayload;
};

export type SuggestionPayload = {
  error: string;
  suggestions: string[];
};

export type RateLimitPayload = {
  text: string;
  reset_time: string;
  time_left: { hours: number; minutes: number; seconds: number };
};

export type ResponsePayload = {
  type: "response" | "summary" | "code";
  /* eslint-disable @typescript-eslint/no-explicit-any */
  metadata: any;
  objects: TextPayload[] | SummaryPayload[] | CodePayload[];
};

export type ResultPayload = {
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  metadata: any;
  code: CodePayload;
  objects:
    | string[]
    | TicketPayload[]
    | SingleMessagePayload[]
    | ThreadPayload[]
    | ProductPayload[]
    | { [key: string]: string }[]
    | AggregationPayload[]
    | DocumentPayload[];
};

export type CodeMetadata = {
  metadata: any;
  code: CodePayload;
};

export type CodePayload = {
  language: string;
  title: string;
  text: string;
};

export type SummaryPayload = {
  text: string;
  title: string;
};

export type ErrorPayload = {
  error: string;
};

export type TextPayload = {
  text: string;
};

export type NERResponse = {
  text: string;
  entity_spans: [number, number][];
  noun_spans: [number, number][];
};

export type TitleResponse = {
  title: string;
  error: string;
};

export type Query = {
  id: string;
  query: string;
  messages: Message[];
  finished: boolean;
  query_start: Date;
  query_end: Date | null;
  feedback: number | null; // -1, 0 , +1
  NER: NERResponse | null;
  index: number;
};
