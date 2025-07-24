import { host } from "@/app/components/host";
import { FeedbackMetadata } from "@/app/components/types";

export async function getFeedback(
  user_id: string | null | undefined
): Promise<FeedbackMetadata> {
  const startTime = performance.now();
  try {
    if (!user_id) {
      return {
        total_feedback: 0,
        feedback_by_value: {
          positive: 0,
          negative: 0,
          superpositive: 0,
        },
        feedback_by_date: {},
      };
    }

    const response = await fetch(`${host}/feedback/metadata/${user_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `Get Feedback error! status: ${response.status} ${response.statusText}`
      );
      return {
        total_feedback: 0,
        feedback_by_value: {
          positive: 0,
          negative: 0,
          superpositive: 0,
        },
        feedback_by_date: {},
      };
    }

    const data: FeedbackMetadata = await response.json();
    return data;
  } catch (error) {
    console.error("Get Feedback error:", error);
    return {
      total_feedback: 0,
      feedback_by_value: {
        positive: 0,
        negative: 0,
        superpositive: 0,
      },
      feedback_by_date: {},
    };
  } finally {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `get feedback took ${(performance.now() - startTime).toFixed(2)}ms`
      );
    }
  }
}
