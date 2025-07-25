/* eslint-disable @typescript-eslint/no-explicit-any */
export const chartResponse: any = {
  id: "12345",
  query: "Create a cool chart",
  messages: [
    {
      type: "User",
      id: "a071da68-e3b0-4206-b3f5-45c815d6e93e",
      query_id: "ac4fc4a7-37c6-4ad6-aab0-74eba49b8930",
      conversation_id: "a5ef6d74-3e72-48c1-b634-21d1b9bf993e",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["Create a cool chart"],
      },
    },
    {
      type: "text",
      id: "tex-2068d1fa-2b9e-4f01-af10-16e1a128c0e8",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "a5ef6d74-3e72-48c1-b634-21d1b9bf993e",
      query_id: "ac4fc4a7-37c6-4ad6-aab0-74eba49b8930",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will now build the most epic chart ever.",
          },
        ],
      },
    },
    {
      type: "result",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "a5ef6d74-3e72-48c1-b634-21d1b9bf993e",
      query_id: "ac4fc4a7-37c6-4ad6-aab0-74eba49b8930",
      id: "res-84474914-71e3-4292-b3c9-65e5a84b07ac",
      payload: {
        type: "chart",
        objects: [
          {
            type: "line",
            values: {
              x: {
                label: "Time",
                data: [
                  "06:00",
                  "07:00",
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                ],
              },
              y: {
                label: "Temperature in Celsius",
                data: [14, 15, 16, 18, 20, 22, 24, 16, 12, 14],
              },
            },
          },
        ],
        metadata: {
          title: "Extreme Cool Chart",
        },
        code: {
          language: "python",
          title: "Chart",
          text: "chart.create(\n    type='bar',\n    label='Coolness',\n    values={'Coolness': [1, 2, 3]}\n)",
        },
      },
    },
    {
      type: "text",
      id: "tex-0df026ef-ec86-4d55-8361-8a4f42b51abe",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "a5ef6d74-3e72-48c1-b634-21d1b9bf993e",
      query_id: "ac4fc4a7-37c6-4ad6-aab0-74eba49b8930",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I've built a chart for you. It's a line chart of the temperature over time.",
          },
        ],
      },
    },
    {
      type: "suggestion",
      id: "33c2b133-6e53-4b6a-8e6e-4e7a276a3249",
      conversation_id: "a5ef6d74-3e72-48c1-b634-21d1b9bf993e",
      query_id: "ac4fc4a7-37c6-4ad6-aab0-74eba49b8930",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        error: "",
        suggestions: [
          "Why is this chart so cool?",
          "What is the temperature at 12:00?",
        ],
      },
    },
  ],
  finished: true,
  query_start: new Date(),
  query_end: new Date(new Date().getTime() + 1000),
  NER: {
    text: "Create a cool chart",
    noun_spans: [],
    entity_spans: [],
  },
  feedback: 1,
  index: 0,
};
