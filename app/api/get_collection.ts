import { CollectionDataPayload } from "@/app/types/payloads";
import { Filter } from "@/app/types/objects";
import { host } from "@/app/components/host";

export async function getCollectionData(
  user_id: string,
  collection_name: string,
  page_number: number,
  page_size: number,
  sort_on: string | null,
  ascending: boolean,
  filter_config: { type: string; filters: Filter[] }
) {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/api/view_paginated_collection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        collection_name,
        page_number,
        page_size,
        sort_on,
        ascending,
        filter_config,
      }),
    });

    if (!response.ok) {
      console.error(
        `Get Collection Data error! status: ${response.status} ${response.statusText}`
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
        `api/view_paginated_collection took ${(
          performance.now() - startTime
        ).toFixed(2)}ms`
      );
    }
  }
}
