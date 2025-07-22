import { host } from "@/app/components/host";
import { SuggestionPayload } from "@/app/types/chat";

export async function getSuggestions(
  user_id: string,
  conversation_id: string,
  auth_key: string,
) {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/util/follow_up_suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        conversation_id,
        auth_key,
      }),
    });

    if (!response.ok) {
      console.error(
        `Error fetching follow_up_suggestions! status: ${response.status} ${response.statusText}`,
      );
      return {
        suggestions: [],
        error: `Error fetching follow_up_suggestions! status: ${response.status} ${response.statusText}`,
      };
    }

    const data: SuggestionPayload = await response.json();
    return data;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return {
      suggestions: [],
      error: `Error fetching follow_up_suggestions!}`,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `util/follow_up_suggestions took ${(performance.now() - startTime).toFixed(2)}ms`,
      );
    }
  }
}
