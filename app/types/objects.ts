import { ToasterToast } from "@/hooks/useToast";

export type VectorizerField = {
  named_vector: string;
  vectorizer: string;
  model: string;
};

export type Vectorizer = {
  fields: {
    [key: string]: VectorizerField[];
  };
  global: VectorizerField;
};

export type Collection = {
  name: string;
  total: number;
  vectorizer: Vectorizer;
  processed: boolean;
  prompts: string[];
};

export type DecisionTreeNode = {
  name: string;
  id: string;
  description: string;
  instruction: string;
  reasoning: string;
  branch: boolean;
  options: { [key: string]: DecisionTreeNode };
  // Note: Added for frontend only - not from backend
  choosen?: boolean;
  blocked?: boolean;
};

export type ModelProvider = {
  [key: string]: Model;
};

export type Model = {
  name: string;
  api_keys: string[];
  speed: string;
  accuracy: string;
};

export type MetadataCollection = {
  mappings: { [key: string]: { [key: string]: [key: string] } };
  fields: { [key: string]: MetadataField };
  length: number;
  summary: string;
  name: string;
  named_vectors: MetadataNamedVector[];
  vectorizer: MetadataVectorizer;
};

export type MetadataVectorizer = {
  vectorizer: string;
  model: string;
};

export type MetadataNamedVector = {
  source_properties: string[];
  enabled: boolean;
  vectorizer: string;
  model: string;
  description: string;
  name: string;
};

export type MetadataField = {
  range: [number, number];
  type: string;
  groups: { [key: string]: GroupMetadataField };
  mean: number;
  name: string;
  description: string;
  date_range: string[];
  date_mean: string;
};

export type GroupMetadataField = {
  value: string;
  count: number;
};

export type Filter = {
  field: string;
  operator: string;
  value: string | number | boolean;
};

export type Toast = {
  collection_name: string;
  progress: number;
  startTime: number; // Add timestamp when analysis started
  currentMessage: string; // Store the current message from backend
  toast: {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
};

export type UserConfig = {
  backend: BackendConfig | null;
  frontend: FrontendConfig | null;
};

export type BackendConfig = {
  name: string;
  style: string;
  agent_description: string;
  end_goal: string;
  branch_initialisation: string;
  id: string | null;
  settings: Settings;
};

export type FrontendConfig = {
  save_trees_to_weaviate: boolean;
  save_configs_to_weaviate: boolean;
  tree_timeout: number;
  client_timeout: number;
  save_location_weaviate_is_local: boolean;
  save_location_wcd_url: string;
  save_location_wcd_api_key: string;
  save_location_local_weaviate_grpc_port: number;
  save_location_local_weaviate_port: number;

  // Support for Custom Weaviate Connections added in 0.2.5
  save_location_weaviate_is_custom: boolean;
  save_location_custom_http_host: string;
  save_location_custom_http_port: number;
  save_location_custom_http_secure: boolean;
  save_location_custom_grpc_host: string;
  save_location_custom_grpc_port: number;
  save_location_custom_grpc_secure: boolean;
};

export type Settings = {
  API_KEYS: {
    [key: string]: string;
  };
  BASE_MODEL: string;
  BASE_PROVIDER: string;
  COMPLEX_MODEL: string;
  COMPLEX_PROVIDER: string;
  LOGGING_LEVEL: string;
  LOGGING_LEVEL_INT: number;
  MODEL_API_BASE: string | null;
  SETTINGS_ID: string;
  USE_FEEDBACK: boolean;
  WCD_API_KEY: string;
  WCD_URL: string;
  WEAVIATE_IS_LOCAL: boolean;
  LOCAL_WEAVIATE_GRPC_PORT: number;
  LOCAL_WEAVIATE_PORT: number;

  // Support for Custom Weaviate Connections added in 0.2.5
  WEAVIATE_IS_CUSTOM: boolean;
  CUSTOM_HTTP_HOST: string;
  CUSTOM_HTTP_PORT: number;
  CUSTOM_HTTP_SECURE: boolean;
  CUSTOM_GRPC_HOST: string;
  CUSTOM_GRPC_PORT: number;
  CUSTOM_GRPC_SECURE: boolean;
};

// For PATCHing collection metadata (matches backend schema)
export type PatchCollectionMetadataPayload = {
  named_vectors?: {
    name: string;
    enabled?: boolean;
    description?: string;
  }[];
  summary?: string;
  mappings?: Record<string, Record<string, string>>;
  fields?: {
    name: string;
    description: string;
  }[];
};

// Tool Builder Objects

export type TreeNode = {
  id: string;
  name: string;
  description: string | null;
  instruction: string | null;
  is_branch: boolean;
  is_root: boolean;
};

export type TreeGraph = {
  id: string;
  name: string;
  default: boolean;
  nodes: { [key: string]: TreeNode };
  edges: [string, string][]; // [[source, target], ...]
};

// Deprecated Tool Builder Objects
// TODO: DELETE AFTER MIGRATION
export type ToolPreset = {
  preset_id: string;
  name: string;
  default: boolean;
  order: ToolItem[];
  branches: BranchInfo[];
};

export type ToolItem = {
  name: string;
  from_branch: string;
  from_tools: string[];
  is_branch: boolean;
};

export type BranchInfo = {
  name: string;
  description: string;
  instruction: string;
};

export type ToolMetadataList = {
  [key: string]: ToolMetadata;
};

export type ToolMetadata = {
  name: string;
  description: string;
  end: boolean; // Whether this tool is allowed to end the chat
  inputs: { [key: string]: ToolMetadataInput };
};

export type ToolMetadataInput = {
  description: string;
  required: boolean;
};
