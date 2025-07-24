import { TreeConfigPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function getTreeConfig(
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
      `${host}/tree/config/${user_id}/${conversation_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Get Tree Config error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Get Tree Config error! status: ${response.status} ${response.statusText}`,
        config: null,
      };
    }

    const data: TreeConfigPayload = await response.json();
    return data;
  } catch (error) {
    console.error("Get Tree Config error:", error);
    return {
      error: error as string,
      config: null,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `get tree config took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
