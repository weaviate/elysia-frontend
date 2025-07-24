import { TreeConfigPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";
import { BackendConfig } from "../types/objects";

export async function saveTreeConfig(
  user_id: string | null | undefined,
  conversation_id: string | null | undefined,
  backend_config: BackendConfig | null
): Promise<TreeConfigPayload> {
  const startTime = performance.now();
  try {
    if (!user_id || !conversation_id || !backend_config) {
      return {
        error: "No user id or backend config",
        config: null,
      };
    }

    const response = await fetch(
      `${host}/tree/config/${user_id}/${conversation_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backend_config),
      }
    );

    if (!response.ok) {
      console.error(
        `Saving Tree Config error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Saving Tree Config error! status: ${response.status} ${response.statusText}`,
        config: null,
      };
    }
    const data: TreeConfigPayload = await response.json();

    console.log("Saving Tree Config response:", data);

    return data;
  } catch (error) {
    console.error("Saving Tree Config error:", error);
    return {
      error: error as string,
      config: null,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Saving Tree Config took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
