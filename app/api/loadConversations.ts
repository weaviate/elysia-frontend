import { SavedConversationPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function loadConversations(user_id: string) {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/db/${user_id}/saved_trees`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error(
        `Error fetching saved trees! status: ${response.status} ${response.statusText}`
      );
      return {
        trees: {},
        error: "Error fetching saved conversations",
      };
    }

    const data: SavedConversationPayload = await response.json();
    return data;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return {
      trees: {},
      error: "Error fetching saved conversations",
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `loadConversations took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
