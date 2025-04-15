import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "@/app/components/types";
import host from "@/app/components/host";

interface setCollectionEnabledRequest {
  collection_names: string[];
  remove_data: boolean;
  conversation_id: string;
  user_id: string;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const {
      collection_names,
      remove_data,
      conversation_id,
      user_id,
    }: setCollectionEnabledRequest = await request.json();
    const res = await fetch(`${host}/api/set_collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection_names,
        remove_data,
        conversation_id,
        user_id,
      }),
    });
    const data: ErrorResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Set Collection Enabled exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    const errorResponse: ErrorResponse = {
      error: errorMessage,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/set_collection_enabled took ${duration}ms`);
  }
}
