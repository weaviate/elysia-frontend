import { host } from "@/app/components/host";
import { ToolPresetPayload } from "../types/payloads";

export async function getToolPresets(
  user_id: string
): Promise<ToolPresetPayload> {
  const startTime = performance.now();
  try {
    const res = await fetch(`${host}/tools/${user_id}`, {
      method: "GET",
    });
    if (!res.ok) {
      console.error(
        `Retrieving tool presets error! status: ${res.status} ${res.statusText}`
      );
      return {
        error: res.statusText,
        presets: [],
      };
    }
    const data: ToolPresetPayload = await res.json();

    return data;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      error: "Error retrieving tool presets",
      presets: [],
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `tools/${user_id} took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
