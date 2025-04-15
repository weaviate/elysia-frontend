import { NextRequest, NextResponse } from "next/server";
import { UserLimitResponse } from "@/app/components/types";
import host from "@/app/components/host";

interface getUserLimitRequest {
  user_id: string;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const { user_id }: getUserLimitRequest = await request.json();
    const res = await fetch(`${host}/api/get_user_requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
      }),
    });
    const data: UserLimitResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Get User Limit exception:", err);
    const errorResponse: UserLimitResponse = {
      num_requests: 0,
      max_requests: 0,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/get_user_limit took ${duration}ms`);
  }
}
