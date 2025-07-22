import { BasePayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function deleteConfig(
  user_id: string | null | undefined,
  config_id: string | null
): Promise<BasePayload> {
  const startTime = performance.now();
  try {
    if (!user_id || !config_id) {
      return {
        error: "No user id or config id",
      };
    }

    const response = await fetch(
      `${host}/user/config/${user_id}/${config_id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error(
        `Deleting Config error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Deleting Config error! status: ${response.status} ${response.statusText}`,
      };
    }

    const data: BasePayload = await response.json();

    return data;
  } catch (error) {
    console.error("Deleting Config error:", error);
    return {
      error: error as string,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Deleting Config took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
