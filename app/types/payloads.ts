import { Collection, DecisionTreeNode } from "@/app/types/objects";

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
