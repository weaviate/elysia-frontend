import { host } from "@/app/components/host";
import { MappingTypesPayload } from "../types/payloads";

export async function getMappingTypes(): Promise<MappingTypesPayload> {
  const startTime = performance.now();
  try {
    const res = await fetch(`${host}/collections/mapping_types`, {
      method: "GET",
    });
    if (!res.ok) {
      console.error(
        `Retrieving mapping types error! status: ${res.status} ${res.statusText}`
      );
      return {
        error: res.statusText,
        mapping_types: [],
      };
    }
    const data: MappingTypesPayload = await res.json();

    return data;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      error: "Error retrieving mapping types",
      mapping_types: [],
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `collections/mapping_types took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
