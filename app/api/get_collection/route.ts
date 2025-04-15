import { NextRequest, NextResponse } from "next/server";
import { CollectionData, Filter } from "@/app/components/types";
import host from "@/app/components/host";

interface getCollectionRequest {
  collection_name: string;
  page_number: number;
  page_size: number;
  sort_on: string | null;
  ascending: boolean;
  filter_config: { type: string; filters: Filter[] };
  admin: boolean;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const {
      collection_name,
      page_number,
      page_size,
      sort_on,
      ascending,
      filter_config,
      admin,
    }: getCollectionRequest = await request.json();

    let endpoint = `/api/view_paginated_collection`;
    if (admin) {
      endpoint = `/api/view_paginated_collection_admin`;
    }

    const res = await fetch(`http://${host}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection_name,
        page_number,
        page_size,
        sort_on,
        ascending,
        filter_config,
      }),
    });
    const data: CollectionData = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Get Collection exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/getCollection took ${duration}ms`);
  }
}
