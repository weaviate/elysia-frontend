import { TreeConfigPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function newTreeConfig(
  user_id: string | null | undefined,
  conversation_id: string | null | undefined
): Promise<TreeConfigPayload> {
  const startTime = performance.now();
  try {
    if (!user_id || !conversation_id) {
      return {
        error: "No user id or conversation id",
        config: null,
      };
    }
    const response = await fetch(
      `${host}/tree/config/${user_id}/${conversation_id}/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `New Tree Config error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `New Tree Config error! status: ${response.status} ${response.statusText}`,
        config: null,
      };
    }

    const data: TreeConfigPayload = await response.json();
    return data;
  } catch (error) {
    console.error("New Tree Config error:", error);
    return {
      error: error as string,
      config: null,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `New Tree Config took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
