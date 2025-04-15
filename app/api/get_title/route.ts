import { NextRequest, NextResponse } from "next/server";
import { TitleResponse } from "@/app/components/types";
import host from "@/app/components/host";

interface getTitleRequest {
  text: string;
  auth_key: string;
  user_id: string;
  conversation_id: string;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const { text, auth_key, user_id, conversation_id }: getTitleRequest =
      await request.json();
    const res = await fetch(`http://${host}/api/title`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        auth_key,
        user_id,
        conversation_id,
      }),
    });

    if (res.status !== 200) {
      console.error(res.status, res.statusText);
      return NextResponse.json(
        {
          title: "Error generating title",
          error: "Invalid auth key",
        },
        { status: 401 }
      );
    }

    const data: TitleResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Get Title exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    const errorResponse: TitleResponse = {
      title: "Error generating title",
      error: errorMessage,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/getTitle took ${duration}ms`);
  }
}
