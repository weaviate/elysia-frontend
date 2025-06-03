import { host } from "@/app/components/host";
import { TitleResponse } from "@/app/types/chat";

export async function getTitle(
  text: string,
  auth_key: string,
  user_id: string,
  conversation_id: string
) {
  const startTime = performance.now();
  try {
    const response = await fetch(`${host}/util/title`, {
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

    if (!response.ok) {
      console.error(
        `Error fetching Title! status: ${response.status} ${response.statusText}`
      );
      return {
        title: "Error generating title",
        error: "",
      };
    }

    const data: TitleResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return {
      title: "Error generating title",
      error: "Error generating title",
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `util/title took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
