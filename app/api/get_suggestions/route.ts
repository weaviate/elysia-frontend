import { NextRequest, NextResponse } from "next/server";
import { SuggestionPayload } from "@/app/components/types";
import host from "@/app/components/host";

interface addSuggestionRequest {
  user_id: string;
  conversation_id: string;
  auth_key: string;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const { user_id, conversation_id, auth_key }: addSuggestionRequest =
      await request.json();
    const res = await fetch(`http://${host}/api/follow_up_suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        conversation_id,
        auth_key,
      }),
    });
    const data: SuggestionPayload = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Get Suggestions exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    const errorResponse: SuggestionPayload = {
      error: errorMessage,
      suggestions: [],
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/get_suggestions took ${duration}ms`);
  }
}
