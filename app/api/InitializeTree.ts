import { DecisionTreePayload } from "@/app/types/payloads";
import { host } from "@/app/components/host";

export async function initializeTree(
  user_id: string,
  conversation_id: string,
  low_memory: boolean = false
): Promise<DecisionTreePayload> {
  const startTime = performance.now();
  try {
    const response = await fetch(
      `${host}/init/tree/${user_id}/${conversation_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          low_memory: low_memory,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `Initializing tree failed! status: ${response.status}, error: ${response.statusText}`
      );
      return {
        conversation_id: conversation_id,
        error: "Failed to initialize tree",
        nodes: {},
        edges: [],
      };
    }

    const data: DecisionTreePayload = await response.json();

    if (data.nodes == null) {
      return {
        conversation_id: conversation_id,
        error: "Failed to initialize tree",
        nodes: {},
        edges: [],
      };
    }

    return data;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return {
      conversation_id: conversation_id,
      error: "Failed to initialize tree",
      nodes: {},
      edges: [],
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `init/tree took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
