import { UserInitPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function initializeUser(
  user_id: string
): Promise<UserInitPayload> {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/init/user/${user_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Initializing user failed! status: ${response.status}, error: ${response.statusText}`
      );
      return {
        error: response.statusText,
        user_exists: false,
        config: null,
        frontend_config: null,
        correct_settings: {
          base_model: false,
          base_provider: false,
          complex_model: false,
          complex_provider: false,
          weaviate_cloud: {
            enabled: false,
            wcd_url: false,
            wcd_api_key: false,
          },
          weaviate_local: {
            enabled: false,
            local_weaviate_port: false,
            local_weaviate_grpc_port: false,
          },
          weaviate_custom: {
            enabled: false,
            custom_http_host: false,
            custom_grpc_host: false,
          },
          elysia_collections_supported: false,
        },
      };
    }

    const data: UserInitPayload = await response.json();

    if (process.env.NODE_ENV === "development") {
      console.log("Initialized user with id: " + user_id);
      console.log("user data: ", data);
    }

    return data;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      error: (err instanceof Error ? err.message : String(err)),
      user_exists: false,
      config: null,
      frontend_config: null,
      correct_settings: {
        base_model: false,
        base_provider: false,
        complex_model: false,
        complex_provider: false,
        weaviate_cloud: {
          enabled: false,
          wcd_url: false,
          wcd_api_key: false,
        },
        weaviate_local: {
          enabled: false,
          local_weaviate_port: false,
          local_weaviate_grpc_port: false,
        },
        weaviate_custom: {
          enabled: false,
          custom_http_host: false,
          custom_grpc_host: false,
        },
        elysia_collections_supported: false,
      },
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `init/user took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
