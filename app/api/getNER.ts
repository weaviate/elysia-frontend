import { host } from "@/app/components/host";
import { NERResponse } from "@/app/types/chat";

export async function getNER(text: string) {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/util/ner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (!response.ok) {
      console.error(
        `Error fetching NER! status: ${response.status} ${response.statusText}`
      );
      return {
        text: text,
        entity_spans: [],
        noun_spans: [],
      };
    }

    const data: NERResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return {
      text: text,
      entity_spans: [],
      noun_spans: [],
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `util/ner took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
