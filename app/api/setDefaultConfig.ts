import { BasePayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function setDefaultConfig(
  user_id: string | null | undefined,
): Promise<BasePayload> {
  const startTime = performance.now();
  try {
    if (!user_id) {
      return { error: "User ID is required" };
    }

    const response = await fetch(`${host}/api/default_config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      console.error(
        `Set Default Config error! status: ${response.status} ${response.statusText}`,
      );
      return { error: "Failed to set default config" };
    }

    const data: BasePayload = await response.json();
    return data;
  } catch (error) {
    console.error("Set Default Config error:", error);
    return { error: "Failed to set default config" };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `api/default_config took ${(performance.now() - startTime).toFixed(
          2,
        )}ms`,
      );
    }
  }
}
