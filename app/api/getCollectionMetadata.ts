import { MetadataPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function getCollectionMetadata(
  user_id: string,
  collection_name: string,
): Promise<MetadataPayload> {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/api/collection_metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, collection_name }),
    });
    if (!response.ok) {
      console.error(
        `Get Collection Metadata error! status: ${response.status} ${response.statusText}`,
      );
      return {
        error: response.statusText,
        metadata: {
          fields: {},
          mappings: {},
          length: 0,
          summary: "",
          name: "",
        },
      };
    }
    const data: MetadataPayload = await response.json();
    return data;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      error: "Error fetching collection metadata",
      metadata: { fields: {}, mappings: {}, length: 0, summary: "", name: "" },
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `api/collection_metadata took ${(performance.now() - startTime).toFixed(
          2,
        )}ms`,
      );
    }
  }
}
