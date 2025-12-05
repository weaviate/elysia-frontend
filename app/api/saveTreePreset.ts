import { host } from "@/app/components/host";
import { TreeGraph } from "../types/objects";
import { ErrorPayload } from "../types/chat";

export async function saveTreePreset(
  user_id: string | null | undefined,
  tree_graph: TreeGraph | null
): Promise<ErrorPayload> {
  const startTime = performance.now();
  try {
    if (!user_id || !tree_graph) {
      return {
        error: "No user id or tree graph",
      };
    }

    const response = await fetch(`${host}/tools/${user_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tree_graph),
    });

    if (!response.ok) {
      console.error(
        `Saving Tree Preset error! status: ${response.status} ${response.statusText}`
      );
      return {
        error: `Saving Tree Preset error! status: ${response.status} ${response.statusText}`,
      };
    }
    const data: ErrorPayload = await response.json();

    return data;
  } catch (error) {
    console.error("Saving Tree Preset error:", error);
    return {
      error: error as string,
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Saving Tree Preset took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
