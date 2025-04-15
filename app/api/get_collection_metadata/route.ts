import { NextRequest, NextResponse } from "next/server";
import { MetadataPayload } from "@/app/components/types";
import host from "@/app/components/host";

interface getCollectionMetadataRequest {
  conversation_id: string;
  user_id: string;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const payload: getCollectionMetadataRequest = await request.json();
    const res = await fetch(`${host}/api/collection_metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data: MetadataPayload = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Get Collection exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/getCollectionMetadata took ${duration}ms`);
  }
}
