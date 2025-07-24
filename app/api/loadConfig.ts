import { ConfigPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function loadConfig(
  user_id: string | null | undefined,
  config_id: string | null
): Promise<ConfigPayload> {
  const startTime = performance.now();
  try {
    if (!user_id || !config_id) {
      return {
        error: "No user id or config id",
        config: null,
        frontend_config: null,
      };
    }

    const response = await fetch(
      `${host}/user/config/${user_id}/${config_id}/load`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error(
        `Loading Config error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Loading Config error! status: ${response.status} ${response.statusText}`,
        config: null,
        frontend_config: null,
      };
    }
    const data: ConfigPayload = await response.json();

    return data;
  } catch (error) {
    console.error("Loading Config error:", error);
    return {
      error: error as string,
      config: null,
      frontend_config: null,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Loading Config took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
