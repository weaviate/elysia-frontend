import { NextRequest, NextResponse } from "next/server";
import { host } from "@/app/components/host";

interface deleteFeedbackRequest {
  user_id: string;
  query_id: string;
  conversation_id: string;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const { user_id, query_id, conversation_id }: deleteFeedbackRequest =
      await request.json();
    const res = await fetch(`${host}/api/remove_feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        query_id,
        conversation_id,
      }),
    });
    const data: { error: string } = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Delete Feedback exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/deleteFeedback took ${duration}ms`);
  }
}
