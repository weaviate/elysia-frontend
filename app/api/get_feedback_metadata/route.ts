import { NextRequest, NextResponse } from "next/server";
import { FeedbackMetadata } from "@/app/components/types";
import host from "@/app/components/host";

interface getFeedbackMetadataRequest {
  user_id: string;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const payload: getFeedbackMetadataRequest = await request.json();
    console.log("Get Feedback Metadata request:", payload);
    const res = await fetch(`${host}/api/feedback_metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.log(`Failed to fetch feedback metadata: ${res.statusText}`);
      return NextResponse.json(null, { status: 500 });
    }
    const data: FeedbackMetadata = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Get Feedback Metadata exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    return NextResponse.json(null, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/getFeedbackMetadata took ${duration}ms`);
  }
}
