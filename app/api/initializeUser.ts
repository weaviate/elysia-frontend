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
        error: "Failed to initialize user",
        user_exists: false,
        config: null,
        frontend_config: null,
        correct_settings: {
          base_model: false,
          base_provider: false,
          complex_model: false,
          complex_provider: false,
          wcd_url: false,
          wcd_api_key: false,
        },
      };
    }

    const data: UserInitPayload = await response.json();

    return data;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      error: "Failed to initialize user",
      user_exists: false,
      config: null,
      frontend_config: null,
      correct_settings: {
        base_model: false,
        base_provider: false,
        complex_model: false,
        complex_provider: false,
        wcd_url: false,
        wcd_api_key: false,
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
