import { NextRequest, NextResponse } from "next/server";
import { CollectionPayload } from "@/app/components/types";
import { host } from "@/app/components/host";

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(request: NextRequest) {
  const startTime = performance.now();
  try {
    const res = await fetch(`${host}/api/collections`);
    const data: CollectionPayload = await res.json();
    if (data.error) {
      console.error(data.error);
    }
    return NextResponse.json(data);
  } catch (err) {
    console.log("Get Collections exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    return NextResponse.json(
      { collections: [], error: errorMessage },
      { status: 500 }
    );
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/getCollections took ${duration}ms`);
  }
}
