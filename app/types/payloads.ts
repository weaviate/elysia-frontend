import {
  Collection,
  DecisionTreeNode,
  MetadataCollection,
} from "@/app/types/objects";

export type BasePayload = {
  error: string;
};

export type CollectionPayload = BasePayload & {
  collections: Collection[];
};

export type DecisionTreePayload = BasePayload & {
  conversation_id: string;
  tree: DecisionTreeNode | null;
};

export type MetadataPayload = BasePayload & {
  metadata: MetadataCollection;
};

export type CollectionDataPayload = BasePayload & {
  properties: { [key: string]: string };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  items: { [key: string]: any }[];
};

export type UserPayload = BasePayload & {
  user_exists: boolean;
  config: ConfigType;
};

export type ConfigType = {
  settings: Record<string, any>;
  style: string;
  agent_description: string;
  end_goal: string;
  branch_initialization: string;
  config_id: string | null;
};