import { host } from "@/app/components/host";
import { ErrorPayload } from "../types/chat";

export async function deleteTreePreset(
  user_id: string | null | undefined,
  preset_id: string | null
): Promise<ErrorPayload> {
  const startTime = performance.now();
  try {
    if (!user_id || !preset_id) {
      return {
        error: "No user id or preset id",
      };
    }

    const response = await fetch(`${host}/tools/${user_id}/${preset_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `Deleting Tree Preset error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Deleting Tree Preset error! status: ${response.status} ${response.statusText}`,
      };
    }
    const data: ErrorPayload = await response.json();

    return data;
  } catch (error) {
    console.error("Deleting Tree Preset error:", error);
    return {
      error: error as string,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Deleting Tree Preset took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
