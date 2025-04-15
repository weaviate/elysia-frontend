import { NextRequest, NextResponse } from "next/server";

interface addSubscriptionRequest {
  email: string;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    console.log("Add Subscription request:");
    const { email }: addSubscriptionRequest = await request.json();
    const pub_id = process.env.BEEHIIV_PUB_ID;
    const api_key = process.env.BEEHIIV_API_KEY;
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pub_id}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + api_key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: false,
        }),
      }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.log("Add Subscription exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/addSubscription took ${duration}ms`);
  }
}
