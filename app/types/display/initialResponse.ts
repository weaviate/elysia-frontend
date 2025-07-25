/* eslint-disable @typescript-eslint/no-explicit-any */
export const InitialResponseQuery: any = {
  id: "12345",
  query: "Let's start this chat!",
  messages: [
    {
      type: "User",
      id: "12345",
      query_id: "12345",
      conversation_id: "12345",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["Let's start this chat!"],
      },
    },
  ],
  finished: false,
  query_start: new Date(),
  query_end: new Date(new Date().getTime() + 1000),
  NER: {
    text: "Let's start this chat!",
    noun_spans: [[17, 21]],
    entity_spans: [],
  },
  feedback: 0,
  index: 0,
};
