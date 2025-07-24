import {
  Collection,
  DecisionTreeNode,
  BackendConfig,
  FrontendConfig,
  MetadataCollection,
  UserConfig,
} from "@/app/types/objects";
import { Message } from "./chat";

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

export type UserInitPayload = BasePayload & {
  error: string;
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
  wcd_url: boolean;
  wcd_api_key: boolean;
};

export type MetadataPayload = BasePayload & {
  metadata: MetadataCollection;
};

export type CollectionDataPayload = BasePayload & {
  properties: { [key: string]: string };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  items: { [key: string]: any }[];
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
};

export type ConfigListPayload = BasePayload & {
  configs: ConfigListEntry[];
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
};

export type MappingTypesPayload = BasePayload & {
  mapping_types: MappingType[];
};

export type MappingType = {
  name: string;
  description: string;
  fields: { [key: string]: string };
};
