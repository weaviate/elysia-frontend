import { ConfigListPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function getConfigList(
  user_id: string | null | undefined
): Promise<ConfigListPayload> {
  const startTime = performance.now();
  try {
    if (!user_id) {
      return {
        error: "No user id",
        configs: [],
      };
    }

    const response = await fetch(`${host}/user/config/${user_id}/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `Get Config List error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Get Config List error! status: ${response.status} ${response.statusText}`,
        configs: [],
      };
    }

    const data: ConfigListPayload = await response.json();
    console.log("Config List:", data);
    return data;
  } catch (error) {
    console.error("Get Config List error:", error);
    return {
      error: error as string,
      configs: [],
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `config/list took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
