import { NextRequest, NextResponse } from "next/server";
import { DecisionTreeNode, DecisionTreePayload } from "@/app/components/types";
import { host } from "@/app/components/host";

interface initializeTreeRequest {
  user_id: string;
  conversation_id: string;
  debug: boolean;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const { user_id, conversation_id, debug }: initializeTreeRequest =
      await request.json();
    const res = await fetch(`${host}/api/initialise_tree`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        conversation_id,
        debug,
      }),
    });

    const data: DecisionTreePayload = await res.json();

    if (res.status !== 200 || data.tree == null) {
      const errorResponse: DecisionTreePayload = {
        tree: null,
        error: "Failed to initialize tree",
        conversation_id: conversation_id,
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const resetChoosenBlocked = (node: DecisionTreeNode) => {
      node.choosen = false;
      node.blocked = false;

      if (node.options) {
        Object.values(node.options).forEach((option) => {
          resetChoosenBlocked(option);
        });
      }
    };
    resetChoosenBlocked(data.tree);
    data.tree.choosen = true;

    return NextResponse.json(data);
  } catch (err) {
    console.log("Initialize Tree exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    const errorResponse: DecisionTreePayload = {
      tree: null,
      error: errorMessage,
      conversation_id: "",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/initialize_tree took ${duration}ms`);
  }
}
