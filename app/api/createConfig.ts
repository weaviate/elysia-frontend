import { ConfigPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function createConfig(
  user_id: string | null | undefined
): Promise<ConfigPayload> {
  const startTime = performance.now();
  try {
    if (!user_id) {
      return {
        error: "No user id",
        config: null,
        frontend_config: null,
      };
    }

    const response = await fetch(`${host}/user/config/${user_id}/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `Creating new Config error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Creating new Config error! status: ${response.status} ${response.statusText}`,
        config: null,
        frontend_config: null,
      };
    }
    const data: ConfigPayload = await response.json();

    return {
      error: "",
      config: data.config,
      frontend_config: data.frontend_config,
    };
  } catch (error) {
    console.error("Creating new Config error:", error);
    return {
      error: error as string,
      config: null,
      frontend_config: null,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Creating new Config took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
