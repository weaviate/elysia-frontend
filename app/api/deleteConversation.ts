import { BasePayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function deleteConversation(
  user_id: string,
  conversation_id: string,
): Promise<BasePayload> {
  const startTime = performance.now();
  try {
    // TODO: change to DELETE once backend supports it
    const response = await fetch(
      `${host}/db/${user_id}/delete_tree/${conversation_id}`,
      {
        method: "DELETE",
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      console.error(
        `Error deleting conversation ${conversation_id}! status: ${response.status} ${response.statusText}`,
      );
      return {
        error: `Error deleting conversation ${conversation_id}`,
      };
    }

    const data: BasePayload = await response.json();
    return data;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return {
      error: `Error deleting conversation ${conversation_id}`,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `deleteConversation ${conversation_id} took ${(performance.now() - startTime).toFixed(2)}ms`,
      );
    }
  }
}
