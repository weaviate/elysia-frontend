import {
  Collection,
  DecisionTreeNode,
  TreeNode,
  BackendConfig,
  FrontendConfig,
  MetadataCollection,
  ModelProvider,
  ToolMetadataList,
  TreeGraph,
} from "@/app/types/objects";
import { Message } from "./chat";

export type BasePayload = {
  error?: string | null;
};

export type CollectionPayload = BasePayload & {
  collections: Collection[];
};

export type DecisionTreePayload = BasePayload & {
  conversation_id: string;
  nodes: { [key: string]: TreeNode };
  edges: [string, string][];
};

export type UserInitPayload = BasePayload & {
  user_exists: boolean;
  config: BackendConfig | null;
  frontend_config: FrontendConfig | null;
  correct_settings: CorrectSettings;
};

export type CorrectSettings = {
  base_model: boolean;
  base_provider: boolean;
  complex_model: boolean;
  complex_provider: boolean;
  weaviate_cloud: {
    enabled: boolean,
    wcd_url: boolean,
    wcd_api_key: boolean,
  },
  weaviate_local: {
    enabled: boolean,
    local_weaviate_port: boolean,
    local_weaviate_grpc_port: boolean,
  },
  weaviate_custom: {
    enabled: boolean,
    custom_http_host: boolean,
    custom_grpc_host: boolean,
  },
  elysia_collections_supported: boolean | null; // New in 0.3.0 - indicates whether current Elysia Collections are outdated and need migration/update - when null, elysia has no connection to weaviate
};

export type MetadataPayload = BasePayload & {
  metadata: MetadataCollection;
};

export type CollectionDataPayload = BasePayload & {
  properties: { [key: string]: string };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  items: { [key: string]: any }[];
};

export type ModelsPayload = BasePayload & {
  models: { [key: string]: ModelProvider };
};

export type SavedConversationPayload = BasePayload & {
  trees: { [key: string]: SavedTreeData | null };
};

export type SavedTreeData = {
  title: string;
  last_update_time: string;
};

export type ConversationPayload = BasePayload & {
  rebuild: Message[];
  metadata: {
    preset_id: string | null;
  };
};

export type ConfigListPayload = BasePayload & {
  configs: ConfigListEntry[];
  warnings: string[];
};

export type ConfigListEntry = {
  config_id: string;
  name: string;
  last_update_time: string;
  default: boolean;
};

export type ConfigPayload = BasePayload & {
  config: BackendConfig | null;
  frontend_config: FrontendConfig | null;
  warnings: string[];
  elysia_collections_supported: boolean | null; // New in 0.3.0 - indicates whether current Elysia Collections are outdated and need migration/update
};

export type TreeConfigPayload = BasePayload & {
  config: BackendConfig | null;
};

export type MappingTypesPayload = BasePayload & {
  mapping_types: MappingType[];
};

export type MappingType = {
  name: string;
  description: string;
  fields: { [key: string]: string };
};

// Tool Builder Payloads

export type ToolPresetPayload = BasePayload & {
  presets: TreeGraph[];
};

export type ToolMetadataListPayload = BasePayload & {
  tools: ToolMetadataList;
};
