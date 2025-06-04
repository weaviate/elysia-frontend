import { BasePayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function deleteCollectionMetadata(
  user_id: string,
  collection_name: string
): Promise<BasePayload> {
  const startTime = performance.now();
  try {
    const response = await fetch(
      `${host}/collections/${user_id}/metadata/${collection_name}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      console.error(
        `Deleting collection metadata error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: response.statusText,
      };
    }
    return {
      error: "",
    };
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      error: "Error deleting collection metadata",
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `collections/metadata/${collection_name} took ${(
          performance.now() - startTime
        ).toFixed(2)}ms`
      );
    }
  }
}
