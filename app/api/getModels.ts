import { ModelsPayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function getModels(): Promise<ModelsPayload> {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/user/config/models`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Error fetching models! status: ${response.status} ${response.statusText}`
      );
      return {
        models: {},
        error: "Error fetching models",
      };
    }

    const data: ModelsPayload = await response.json();
    return data;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return {
      models: {},
      error: "Error fetching models",
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `models/get took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
