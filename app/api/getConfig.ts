import { ConfigPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function getConfig(
  user_id: string | null | undefined
): Promise<ConfigPayload> {
  const startTime = performance.now();
  try {
    if (!user_id) {
      return {
        error: "No user id",
        config: null,
        frontend_config: null,
        warnings: [],
      };
    }

    const response = await fetch(`${host}/user/config/${user_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `Get Config error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Get Config error! status: ${response.status} ${response.statusText}`,
        config: null,
        frontend_config: null,
        warnings: [],
      };
    }

    const data: ConfigPayload = await response.json();
    return data;
  } catch (error) {
    console.error("Get Config error:", error);
    return {
      error: error as string,
      config: null,
      frontend_config: null,
      warnings: [],
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `get config took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
