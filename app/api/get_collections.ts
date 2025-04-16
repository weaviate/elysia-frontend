import { CollectionPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";
import { Collection } from "../types/objects";

export async function getCollections(user_id: string): Promise<Collection[]> {
  const startTime = performance.now();
  try {
    if (!user_id) {
      return [];
    }

    const response = await fetch(`${host}/api/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
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
        `api/collections took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
