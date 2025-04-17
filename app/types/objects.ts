export type Collection = {
  name: string;
  total: number;
  //TODO: Waiting to figure out with Danny how to best solve this
  /* eslint-disable @typescript-eslint/no-explicit-any */
  vectorizer: any;
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
