/* eslint-disable @typescript-eslint/no-explicit-any */
export const TextResponse: any = {
  id: "12345",
  query: "What is Elysia?",
  messages: [
    {
      type: "User",
      id: "c4ad2b35-9628-44b8-b443-f52f9ad58826",
      query_id: "8273a7f3-d43c-4559-8e68-d77f7a1a14a3",
      conversation_id: "6154bd36-a29f-4ce8-9815-4c20d54249f8",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["What is Elysia?"],
      },
    },
    {
      type: "text",
      id: "tex-c4516e1b-e96f-4794-9a91-57e8752c7b84",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "6154bd36-a29f-4ce8-9815-4c20d54249f8",
      query_id: "8273a7f3-d43c-4559-8e68-d77f7a1a14a3",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "Elysia is an agentic retrieval augmented generation (RAG) service, where you can query from Weaviate collections, and I will retrieve the most relevant information and answer your question. This includes a variety of different ways to query, such as by filtering, sorting, querying multiple collections, and providing summaries and textual responses.",
          },
        ],
      },
    },
  ],
  finished: true,
  query_start: new Date(),
  query_end: new Date(new Date().getTime() + 1000),
  NER: {
    text: "What is Elysia?",
    noun_spans: [],
    entity_spans: [[8, 14]],
  },
  feedback: 2,
  index: 0,
};
