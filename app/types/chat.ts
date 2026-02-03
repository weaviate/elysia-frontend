import { TreeUpdatePayload } from "@/app/components/types";
import {
  TicketPayload,
  SingleMessagePayload,
  ThreadPayload,
  ProductPayload,
  AggregationPayload,
  DocumentPayload,
  BarPayload,
  ScatterOrLinePayload,
  HistogramPayload,
} from "@/app/types/displays";
import { TreeNode } from "./objects";

export type Message = {
  type:
    | "result"
    | "self_healing_error"
    | "ner"
    | "title"
    | "user_prompt"
    | "error"
    | "tree_timeout_error"
    | "user_timeout_error"
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
    | "suggestion"
    | "graph"
    | "edge";
  conversation_id: string;
  id: string;
  streamed: boolean; // New field since 0.3.0 - indicates if the message is part of a streaming response
  user_id: string;
  query_id: string;
  payload:
    | ResultPayload
    | TextPayload
    | TextPayloadStreamed
    | ErrorPayload
    | RateLimitPayload
    | ResponsePayload
    | TreeUpdatePayload
    | SuggestionPayload
    | UserPromptPayload
    | SelfHealingErrorPayload
    | MergedSelfHealingErrorPayload
    | GraphPayload
    | EdgePayload
    | NERPayload
    | SystemTextPayload
  | EndPayloadStreamed;
};

export type SystemTextPayload = {
  text: string;
};

export type GraphPayload = {
  nodes: { [key: string]: TreeNode };
  edges: [string, string][]; // [[source, target], ...]
};

export type EdgePayload = {
  from: string;
  to: string;
  reasoning: string;
  tree_index: number;
  reset_tree: boolean;
};

export type SelfHealingErrorPayload = {
  error_message: string;
  feedback: string;
};

export type MergedSelfHealingErrorPayload = {
  type: "merged_self_healing_errors";
  payloads: SelfHealingErrorPayload[];
  latest: SelfHealingErrorPayload;
};

export type NERPayload = {
  text: string;
  entity_spans: [number, number][];
  noun_spans: [number, number][];
};

export type TitlePayload = {
  title: string;
  error: string;
};

export type UserPromptPayload = {
  prompt: string;
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

// Deprecated - using TextPayload and StreamedTextPayload instead
export type ResponsePayload = {
  type:
    | "response"
    | "summary"
    | "code"
    | "text_with_citations"
    | "text_with_title";
  /* eslint-disable @typescript-eslint/no-explicit-any */
  metadata: any;
  objects:
    | TextPayload[]
    | SummaryPayload[]
    | CodePayload[]
    | TextWithCitationsPayload[];
};

export type ResultPayload = {
  type:
    | "text"
    | "ticket"
    | "message"
    | "conversation"
    | "product"
    | "ecommerce"
    | "generic"
    | "table"
    | "aggregation"
    | "mapped"
    | "document"
    | "bar_chart"
    | "histogram_chart"
    | "scatter_or_line_chart";

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
    | DocumentPayload[]
    | BarPayload[]
    | ScatterOrLinePayload[]
    | HistogramPayload[];
};

export type TextWithCitationsPayload = {
  text: string;
  ref_ids: string[];
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

export type TextMetadata = {
  title: string;
  reasoning: boolean;
  tool_name: string;
};

export type TextObject = {
  text: string;
  ref_ids: string[];

};

export type TextPayload = {
  type: "text";
  objects: TextObject[];
  metadata: TextMetadata;
};

export type EndPayloadStreamed = {
  chunk: {
    reasoning?: string;
    cited_text?: TextObject[];
  }
  index: number | null;
  stream_id: string;
  type: "end";
}

export type TextPayloadStreamed = {
  type: "text" | "citation" | "metadata" | "end" // Concat, Append, Replace, End
  chunk: string | TextMetadata
  index: number;
  stream_id: string;
}

export type Query = {
  id: string;
  query: string;
  messages: Message[];
  finished: boolean;
  query_start: Date;
  query_end: Date | null;
  feedback: number | null; // -1, 0 , +1
  NER: NERPayload | null;
  index: number;
  // New Tree Update
  graph: GraphPayload;
  edges: EdgePayload[];
};
