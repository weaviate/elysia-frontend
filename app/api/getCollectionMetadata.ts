import { MetadataPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function getCollectionMetadata(
  user_id: string,
  collection_name: string
): Promise<MetadataPayload> {
  const startTime = performance.now();
  try {
    const response = await fetch(
      `${host}/collections/${user_id}/metadata/${collection_name}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      console.error(
        `Retrieving collection metadata error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: response.statusText,
        metadata: {
          fields: {},
          mappings: {},
          length: 0,
          summary: "",
          name: "",
          named_vectors: [],
        },
      };
    }
    const data: MetadataPayload = await response.json();

    console.log("METADATA DEBUG", data);

    return data;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      error: "Error retrieving collection metadata",
      metadata: {
        fields: {},
        mappings: {},
        length: 0,
        summary: "",
        name: "",
        named_vectors: [],
      },
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `collections/metadata took ${(performance.now() - startTime).toFixed(
          2
        )}ms`
      );
    }
  }
}
