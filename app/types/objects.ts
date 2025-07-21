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
};

export type DecisionTreeNode = {
  name: string;
  id: string;
  description: string;
  instruction: string;
  reasoning: string;
  options: { [key: string]: DecisionTreeNode };
  // Note: Added for frontend only - not from backend
  choosen?: boolean;
  blocked?: boolean;
};

export type MetadataCollection = {
  mappings: { [key: string]: { [key: string]: [key: string] } };
  fields: { [key: string]: MetadataField };
  length: number;
  summary: string;
  name: string;
};

export type MetadataField = {
  range: [number, number];
  type: string;
  groups: string[];
  mean: number;
};

export type Filter = {
  field: string;
  operator: string;
  value: string | number | boolean;
};

export type Toast = {
  collection_name: string;
  progress: number;
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
  save_location_wcd_url: string;
  save_location_wcd_api_key: string;
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
};
