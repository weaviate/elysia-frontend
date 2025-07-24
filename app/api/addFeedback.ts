import { host } from "@/app/components/host";
import { BasePayload } from "@/app/types/payloads";

export async function addFeedback(
  user_id: string | null | undefined,
  conversation_id: string,
  query_id: string,
  feedback: number
): Promise<BasePayload> {
  const startTime = performance.now();
  try {
    if (!user_id) {
      return {
        error: "No user id",
      };
    }

    const response = await fetch(`${host}/feedback/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        conversation_id,
        query_id,
        feedback,
      }),
    });

    if (!response.ok) {
      console.error(
        `Add Feedback error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: "Failed to add feedback",
      };
    }

    const data: BasePayload = await response.json();
    return data;
  } catch (error) {
    console.error("Add Feedback error:", error);
    return {
      error: "Failed to add feedback",
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `add feedback took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
