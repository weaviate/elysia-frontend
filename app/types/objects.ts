import { ToasterToast } from "@/hooks/useToast";

export type VectorizerField = {
  named_vector: string;
  vectorizer: string;
  model: string;
};

export type Vectorizer = {
  fields: {
    [key: string]: VectorizerField;
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
  settings: Record<string, any>;
  style: string;
  agent_description: string;
  end_goal: string;
  branch_initialisation: string;
  config_id: string | null;
};
