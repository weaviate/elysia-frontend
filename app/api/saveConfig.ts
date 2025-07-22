import { ConfigPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";
import { BackendConfig, FrontendConfig } from "../types/objects";

export async function saveConfig(
  user_id: string | null | undefined,
  backend_config: BackendConfig | null,
  frontend_config: FrontendConfig | null,
  default_config: boolean = true
): Promise<ConfigPayload> {
  const startTime = performance.now();
  try {
    if (!user_id || !backend_config) {
      return {
        error: "No user id or backend config",
        config: null,
        frontend_config: null,
      };
    }

    const response = await fetch(
      `${host}/user/config/${user_id}/${backend_config.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: backend_config.name,
          config: backend_config,
          frontend_config: frontend_config,
          default: default_config,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `Saving Config error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Saving Config error! status: ${response.status} ${response.statusText}`,
        config: null,
        frontend_config: null,
      };
    }
    const data: ConfigPayload = await response.json();

    console.log("Saving Config response:", data);

    return data;
  } catch (error) {
    console.error("Saving Config error:", error);
    return {
      error: error as string,
      config: null,
      frontend_config: null,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Saving Config took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
