import { NextRequest, NextResponse } from "next/server";
import { DebugResponse } from "@/app/components/debugging/types";
import host from "@/app/components/host";

interface DebugRequest {
  user_id: string;
  conversation_id: string;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const { user_id, conversation_id }: DebugRequest = await request.json();
    const res = await fetch(`${host}/api/debug`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        conversation_id,
      }),
    });

    const data: DebugResponse = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.log("Get Debug exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    const errorResponse: DebugResponse = { error: errorMessage };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/get_debug took ${duration}ms`);
  }
}
