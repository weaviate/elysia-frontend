import { UserPayload, ConfigType } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function initializeUser(
  user_id: string,
  conversation_id: string,
  settings: Record<string, any> | null = null,
  style: string | null = null,
  agent_description: string | null = null,
  end_goal: string | null = null,
  branch_initialization: "one_branch" | "multi_branch" | "empty" | null = null,
): Promise<UserPayload> {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/init/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        conversation_id,
        settings,
        style,
        agent_description,
        end_goal,
        branch_initialization,
      }),
    });

    if (!response.ok) {
      console.error(
        `Initializing user failed! status: ${response.status}, error: ${response.statusText}`,
      );
      return {
        user_exists: false,
        error: "Failed to initialize user",
        config: {
          settings: {},
          style: "",
          agent_description: "",
          end_goal: "",
          branch_initialization: "",
          config_id: null,
        } as ConfigType,
      };
    }

    const data: UserPayload = await response.json();

    if (data.user_exists == false) {
      return {
        user_exists: false,
        error: "Failed to initialize user",
        config: {
          settings: {},
          style: "",
          agent_description: "",
          end_goal: "",
          branch_initialization: "",
          config_id: null,
        } as ConfigType,
      };
    }

    return data;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      user_exists: false,
      error: "Failed to initialize user",
      config: {
        settings: {},
        style: "",
        agent_description: "",
        end_goal: "",
        branch_initialization: "",
        config_id: null,
      } as ConfigType,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `/init/user took ${(performance.now() - startTime).toFixed(
          2,
        )}ms`,
      );
    }
  }
}
