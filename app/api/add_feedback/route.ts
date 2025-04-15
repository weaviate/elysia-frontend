import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/app/components/types";
import host from "@/app/components/host";

interface addFeedbackRequest {
  user_id: string;
  conversation_id: string;
  query_id: string;
  feedback: number;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const { user_id, conversation_id, query_id, feedback }: addFeedbackRequest =
      await request.json();
    const res = await fetch(`http://${host}/api/add_feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        conversation_id,
        query_id,
        feedback,
      }),
    });
    const data: ErrorResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Add Feedback exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    const errorResponse: ErrorResponse = {
      error: errorMessage,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/add_feedback took ${duration}ms`);
  }
}
