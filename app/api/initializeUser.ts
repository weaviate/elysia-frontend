import { UserInitPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function initializeUser(
  user_id: string,
  default_models: boolean = true,
  settings: Record<string, any> | null = null,
  style: string | null = null,
  agent_description: string | null = null,
  end_goal: string | null = null,
  branch_initialisation: string | null = null,
): Promise<UserInitPayload> {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/init/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        default_models,
        style,
        agent_description,
        end_goal,
        branch_initialisation,
        settings,
      }),
    });

    if (!response.ok) {
      console.error(
        `Initializing user failed! status: ${response.status}, error: ${response.statusText}`,
      );
      return {
        error: "Failed to initialize user",
        user_exists: false,
        config: null,
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
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `init/user took ${(performance.now() - startTime).toFixed(2)}ms`,
      );
    }
  }
}
