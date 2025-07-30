import { BasePayload } from "./payloads";

export type ProcessingSocketPayload = BasePayload & {
  type: string;
  progress: number;
  message: string;
  collection_name: string;
};
