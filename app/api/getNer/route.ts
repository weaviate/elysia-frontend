import { NextRequest, NextResponse } from "next/server";
import { NERResponse } from "@/app/components/types";
import { host } from "@/app/components/host";

interface getNERRequest {
  text: string;
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const { text }: getNERRequest = await request.json();
    const res = await fetch(`${host}/api/ner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });
    const data: NERResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Get NER exception:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    const errorResponse: NERResponse = {
      text: errorMessage,
      entity_spans: [],
      noun_spans: [],
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log(`api/getNER took ${duration}ms`);
  }
}
