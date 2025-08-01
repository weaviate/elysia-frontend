import { CollectionDataPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function getObject(
  user_id: string,
  collection_name: string,
  uuid: string
) {
  const startTime = performance.now();
  try {
    const response = await fetch(
      `${host}/collections/${user_id}/get_object/${collection_name}/${uuid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Error fetching object! status: ${response.status} ${response.statusText}`
      );
      return {
        properties: {},
        items: [],
        error: "Error fetching object",
      };
    }

    const data: CollectionDataPayload = await response.json();
    return data;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return {
      properties: {},
      items: [],
      error: "Error fetching object",
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `collections/get_object took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
