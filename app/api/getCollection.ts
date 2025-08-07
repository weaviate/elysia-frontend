import { CollectionDataPayload } from "@/app/types/payloads";
import { Filter } from "@/app/types/objects";
import { host } from "@/app/components/host";

export async function getCollectionData(
  user_id: string,
  collection_name: string,
  _page_number: number,
  page_size: number,
  sort_on: string | null,
  ascending: boolean,
  filter_config: { type: string; filters: Filter[] },
  query: string
) {
  // Ensure page number is at least 1
  const page_number = Math.max(_page_number, 1);

  const startTime = performance.now();
  try {
    const response = await fetch(
      `${host}/collections/${user_id}/view/${collection_name}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_number,
          page_size,
          sort_on,
          ascending,
          filter_config,
          query,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `Error fetching collection data! status: ${response.status} ${response.statusText}`
      );
      return {
        properties: {},
        items: [],
        error: "Error fetching collection data",
      };
    }

    const data: CollectionDataPayload = await response.json();
    return data;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return {
      properties: {},
      items: [],
      error: "Error fetching collection data",
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `collections/view took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
