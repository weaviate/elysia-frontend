import { host } from "@/app/components/host";
import { ToolMetadataListPayload } from "../types/payloads";

export async function getToolMetadata(): Promise<ToolMetadataListPayload> {
  const startTime = performance.now();
  try {
    const res = await fetch(`${host}/tools/available`, {
      method: "GET",
    });
    if (!res.ok) {
      console.error(
        `Retrieving tool metadata error! status: ${res.status} ${res.statusText}`
      );
      return {
        error: res.statusText,
        tools: {},
      };
    }
    const data: ToolMetadataListPayload = await res.json();

    return data;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      error: "Error retrieving tool metadata",
      tools: {},
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `tools/available took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
