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
