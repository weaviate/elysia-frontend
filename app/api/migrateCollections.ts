import { BasePayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function migrateCollections(
  reset: boolean = false, // if true, all collections will be deleted and re-created, if false, data will be migrated to the new format
  user_id: string | null | undefined,
): Promise<BasePayload> {
  const startTime = performance.now();
  if (!user_id) {
    return {
      error: "User ID is required",
    };
  }
  try {
    const response = await fetch(
      `${host}/util/migrate/${user_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset }),
      }
    );

    if (!response.ok) {
      console.error(
        `Collection Migration error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Collection Migration error! status: ${response.status} ${response.statusText}`,
      };
    }

    const data: BasePayload = await response.json();
    return data;

  } catch (error) {
    console.error("Collection Migration error:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Collection Migration took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
