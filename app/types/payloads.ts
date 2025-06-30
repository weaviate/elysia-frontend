import {
  Collection,
  DecisionTreeNode,
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
  config: UserConfig | null;
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
  configs: string[];
};

export type ConfigPayload = BasePayload & {
  config: UserConfig | null;
};
