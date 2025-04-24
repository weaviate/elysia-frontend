import { BasePayload } from "./payloads";

export type ProcessingSocketPayload = BasePayload & {
  type: string;
  progress: number;
  collection_name: string;
};
