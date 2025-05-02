import { v4 as uuidv4 } from "uuid";
import { DebugMessage } from "./debugging/types";
import { DecisionTreeNode } from "@/app/types/objects";
import { DocumentPayload, Product, Ticket } from "@/app/types/displays";

export type Message = {
  type:
    | "result"
    | "merged_result"
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
    | MergedDocumentPayload
    | MergedConversationPayload
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
    | Ticket[]
    | ConversationMessage[]
    | ConversationDisplayType[] // A list of lists of ConversationMessages
    | Product[]
    | { [key: string]: string }[]
    | AggregationPayload[]
    | DocumentPayload[];
};

export type MergedDocumentPayload = {
  type: "merged_document";
  code_metadata: CodeMetadata[];
  objects: DocumentPayload[];
};

export type MergedConversationPayload = {
  type: "merged_conversation";
  code_metadata: CodeMetadata[];
  objects: ConversationDisplayType[];
};

export type CodeMetadata = {
  metadata: any;
  code: CodePayload;
};

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

export type TextPayload = {
  text: string;
};

export type SummaryPayload = {
  text: string;
  title: string;
};

export type CodePayload = {
  language: string;
  title: string;
  text: string;
};

export type ErrorPayload = {
  error: string;
};

export type ObjectRelevancyPayload = {
  conversation_id: string;
  any_relevant: boolean;
  error: string;
};

export type ConversationDisplayType = {
  conversation_id: string;
  summary?: string;
  messages: ConversationMessage[];
};

export type ConversationMessage = {
  uuid: string;
  summary?: string;
  relevant: boolean;
  conversation_id: number;
  message_id: string;
  author: string;
  content: string;
  timestamp: string;
};

export type TreeUpdatePayload = {
  node: string;
  decision: string;
  tree_index: number;
  reasoning: string;
  reset: boolean;
};

export type Conversation = {
  enabled_collections: { [key: string]: boolean };
  id: string;
  name: string;
  tree_updates: TreeUpdatePayload[];
  tree: DecisionTreeNode[];
  base_tree: DecisionTreeNode | null;
  queries: { [key: string]: Query };
  current: string;
  timestamp: Date;
  initialized: boolean;
  error: boolean;
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

export type NERResponse = {
  text: string;
  entity_spans: [number, number][];
  noun_spans: [number, number][];
};

export type TitleResponse = {
  title: string;
  error: string;
};

export type ErrorResponse = {
  error: string;
};

export type FeedbackMetadata = {
  total_feedback: number;
  feedback_by_value: {
    positive: number;
    negative: number;
    superpositive: number;
  };
  feedback_by_date: {
    [key: string]: {
      mean: number;
      count: number;
      positive: number;
      negative: number;
      superpositive: number;
    };
  };
  call_speed_by_base_model: { [key: string]: QueryStats };
  call_speed_by_complex_model: { [key: string]: QueryStats };
  full_query_time: QueryStats;
};

export type QueryStats = {
  mean: number;
  maximum: number;
  minimum: number;
};

export type Feedback = {
  properties: { [key: string]: string };
  items: FeedbackItem[];
  error: string;
};

export type FeedbackItem = {
  conversation_history: DebugMessage[];
  route: string[];
  user_prompt: string;
  conversation_id: string;
  tasks_completed: TaskCompleted[];
  complex_lm_used: string;
  query_id: string;
  feedback: number;
  feedback_date: string;
  user_id: string;
  action_information: Action[];
  base_lm_used: string;
  current_message: string;
  time_taken_seconds: number;
  initialisation: string;
};

export type TaskCompleted = {
  prompt: string;
  task: Task[];
};

export type Task = {
  todo: string;
  count: number;
  extra_string: string;
  reasoning: string;
  task: string;
  action: boolean;
};

export type Action = {
  collection_name: string;
  action_name: string;
  return_type: string;
  output_type: string;
  code: CodePayload;
};

export type UserLimitResponse = {
  num_requests: number;
  max_requests: number;
};

// Example Objects

export const initialConversation: Conversation = {
  id: uuidv4(),
  name: "New Conversation",
  error: false,
  tree_updates: [],
  timestamp: new Date(),
  enabled_collections: {},
  tree: [],
  base_tree: null,
  current: "",
  queries: {},
  initialized: false,
};

export const example_prompts: string[] = [
  "What is Elysia?",
  "What data sources are available in Elysia?",
  "What's the average price per fashion collection?",
  "Summarize the last 10 Github issues",
  "Aggregate all usernames that wrote issues",
  "What was the last conversation of Edward?",
  "When was the highest wind speed?",
  "Average wind speed in 2016",
  "How does HNSW work?",
  "Can you recommend me some green pants?",
  "What could I wear at a wedding?",
  "What are the most expensive products in the ecommerce collection?",
  "What is Sentiment Analysis?",
  "What is Weaviate?",
  "How does Hybrid Search work?",
  "What is a vector database?",
  "Show me all Tops in the Fairycore collection",
  "List all Footwear items tagged as 'bestsellers'",
  "Which Dresses & Jumpsuits are currently available in Dark Academia style?",
  "Find all items priced under $50",
  "Which products are between $100 and $150 and have at least one color option in black?",
  "List the most expensive items from the Techwear collection",
  "Show me all Nova Nest products with a rating of 4.7 or higher",
  "Which Canvas & Co. items have the highest average rating in the Outerwear category?",
  "Find all items available in at least two different color options",
  "Which bags (Accessories subcategory) come in both red and black?",
  "Show me products with descriptions containing the word 'cozy'",
  "List all Fairycore-themed items whose product description includes 'lace'",
  "List all items from the Y2K collection sorted by price",
  "Are there any Light Academia items in the footwear category?",
  "Show me items that have more than 10 reviews but an overall rating below 4.6",
  "Which accessories are currently on sale?",
  "What Fairycore tops are new in stock?",
  "Which brand has the highest average rating across all collections?",
  "Find the average price of Tops in the Techwear collection",
  "What is the most common color across all products?",
  "Show me all items from Loom & Aura priced between $50 and $100, rated 4.7 or higher, with at least 2 color options",
  "For each subcategory in the Dark Academia collection, list the top-rated product",
  "Find the top 5 products by rating that are under $75 and part of the Y2K or Cottagecore collections",
  "Find all items with the 'Limited Edition' tag in the Outerwear category",
  "Show me all messages from Alice",
  "Find all project update messages sent in Q1 2024",
  "List all messages sent by Vin from December 2023 to January 2024",
  "Show all conversations that discuss 'release deadlines' or 'launch dates'",
  "Find the first message timestamp in the dataset and the last message timestamp",
  "Identify all messages categorized as technical support requests",
  "Show me the conversation threads where Kaladin is one of the authors",
  "Search for all messages containing the words 'bug fix' or 'crash'",
  "Which conversations contain at least one 'meeting coordination' message?",
  "Find messages labeled as 'error reporting' that were sent outside of work hours",
  "List the top 5 conversations by total number of messages",
  "Which messages specifically mention 'urgent' or 'ASAP' in the content",
  "Find all messages from Sofia that talk about 'feature requests'",
  "Count how many times the word 'deadline' appears across all messages",
  "List all messages sent during January 2024 (by timestamp)",
  "Find the average message_index (thread length) per conversation",
  "Which conversations have messages from both Alice and Vin",
  "Show me the earliest conversation and the latest conversation present in the dataset",
  "Show all open issues labeled 'bug'",
  "List issues with more than 5 comments",
  "Which issues are currently labeled 'investigating' and still open",
  "Show me the closed issues related to 'Docker deployment'",
  "List all issues created after September 1, 2023",
  "Which issues mention 'Azure OpenAI' in their title or content?",
  "Find all issues labeled both 'frontend' and 'documentation'",
  "Show the 10 most recently updated issues",
  "Which issues were closed in October 2024?",
  "Find issues containing 'embedding failures' in the content and sort them by the number of comments",
  "List all issues that mention 'Weaviate' in the content but are not labeled as 'bug' or 'enhancement'",
  "Display the URL and title of all issues that are labeled 'documentation'",
  "Find the total number of open vs. closed issues in the repository",
  "Which issues have been reopened or updated multiple times (more than 2 updates)?",
  "List issues with comments greater than 10 sorted by updated date",
  "Display all issue IDs with label 'bug' along with their creation dates",
  "Find the user who created the most issues labeled 'enhancement'",
  "Which issues specifically discuss 'embedding documents'?",
  "List issues that have a creation date in 2024 and are still open",
  "Show me all messages from Kaladin",
  "Find messages that mention 'deployment' or 'infrastructure'",
  "Which messages are related to code reviews?",
  "Show me messages from Sofia sent in 2024",
  "Which conversations contain discussions about 'API integration'?",
  "Which conversations have 10 messages?",
  "Which messages mention 'feature development' or 'new feature'?",
  "Which messages contain requests for code reviews?",
  "List every message with 'to-do' or 'action item' in the content",
  "Display messages sent during meeting times (e.g., 9am to 5pm local time)",
  "Count how many messages were sent in March 2024",
  "Find the earliest conversation and its creation date",
  "Which messages mention a 'deadline' or 'due date'?",
  "Find articles mentioning 'reinforcement learning' in the title",
  "List articles containing 'Transformer architecture' in their content",
  "Show the summary of the article titled 'Convolutional Neural Network'",
  "Find all articles whose categories include both 'computer vision' and 'data mining'",
  "Which articles have more than five categories assigned?",
  "List the URLs of all articles referencing 'natural language processing'",
  "Which articles mention 'mathematical formulas' in their content?",
  "Show articles that have 'history' or 'historical context' in their summary",
  "Display the last modified date for articles containing 'chatbots'",
  "How many articles reference 'knowledge representation' in their categories?",
  "Find articles covering both 'machine learning' and 'knowledge graphs'",
  "Which articles contain references to 'GANs' (Generative Adversarial Networks)?",
  "Show the categories associated with the article titled 'Support Vector Machine'",
  "Find articles that mention 'ethical concerns' or 'bias in AI' in the content",
  "Which articles have summaries mentioning 'practical applications' of AI?",
  "Show me the earliest and latest modification dates in the dataset",
  "List all articles with the phrase 'emerging trends' in the summary",
  "Show me all days where the precipitation type is 'snow'?",
  "Which days have a 'Foggy' weather summary?",
  "List the top 5 coldest days by actual temperature (in Celsius)",
  "Find days where wind speed exceeds 40 km/h",
  "Display the average humidity on days with 'Overcast' conditions",
  "Show all records where precipitation type is 'rain' and temperature is below 0°C",
  "List the date and wind bearing for days with more than 80% cloud cover",
  "Find all entries with visibility less than 1 km",
  "Show me the daily weather summaries for each date, sorted by earliest to latest",
  "List the total number of 'NaN' precipitation type entries",
  "Which days have atmospheric pressure above 1020 millibars and a 'Clear' weather summary?",
  "Display the humidity and wind speed for dates in January with 'Mostly Cloudy' conditions",
  "Find days with relative humidity above 0.9 and temperature below 5°C",
  "List all dates where the visibility is at least 10 km and the weather summary is 'Partly Cloudy'",
  "List blog posts that include code snippets related to AI integration",
  "Which posts discuss product announcements or updates?",
  "Find all blog posts that mention 'search functionality'",
  "Which blog posts mention 'Weaviate' and include the word 'deployment' in their content?",
  "List the titles of blog posts published about best practices in software development",
  "Find posts covering conceptual explanations of vector searches or embeddings",
  "Which blog posts include the phrase 'community update' or 'company update'?",
  "Show all posts with 'implementation guides' or 'tutorials' in the content text",
  "List the URLs of blog posts that discuss AI, specifically referencing 'machine learning'",
  "Which posts include practical code examples for integrating AI with Weaviate?",
  "Find articles that mention real-world use cases of vector databases",
  "List blog posts offering step-by-step instructions for developers (implementation details)",
  "Which articles discuss new features or product enhancements in Weaviate?",
  "Show me all documentation files that mention 'installation' or 'setup' in the content",
  "Which documents include detailed API references for Weaviate?",
  "Find all guides that discuss configuration options for clustering or replication",
  "List documentation pages containing integration tutorials with Python",
  "Which docs describe how to use the GraphQL endpoint with Weaviate?",
  "Show me documents mentioning Docker-based deployment or docker-compose",
  "Which guides explain how to configure authentication or access control?",
  "Find documentation that covers conceptual explanations of vector searches and embeddings",
  "List all tutorial pages (titles) that include step-by-step instructions",
  "Which docs provide advanced configuration details for indexing or schema management?",
];
