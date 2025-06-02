import { CollectionPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";
import { Collection } from "../types/objects";

export async function getCollections(
  user_id: string | null | undefined,
): Promise<Collection[]> {
  const startTime = performance.now();
  try {
    if (!user_id) {
      return [];
    }

    const response = await fetch(`${host}/collections/${user_id}/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `Get Collections error! status: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const data: CollectionPayload = await response.json();
    return data.collections;
  } catch (error) {
    console.error("Get Collections error:", error);
    return [];
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `collections/list took ${(performance.now() - startTime).toFixed(
          2,
        )}ms`,
      );
    }
  }
}
