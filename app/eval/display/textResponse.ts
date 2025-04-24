/* eslint-disable @typescript-eslint/no-explicit-any */
export const TextResponseQuery: any = {
  id: "12345",
  query: "What is Elysia?",
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
        objects: ["What is Elysia?"],
      },
    },
    {
      type: "text",
      id: "12345",
      query_id: "12345",
      conversation_id: "12345",
      payload: {
        type: "response",
        metadata: null,
        objects: [
          {
            text: "Elysia is an agentic retrieval augmented generation (RAG) service within Weaviate. I'm here to help you query Weaviate's collections, retrieve relevant information, and answer your questions. This includes various ways to query, such as filtering, sorting, querying multiple collections, and providing summaries and textual responses. I'll dynamically display retrieved objects from the collections. I work via a tree-based approach, using your question to generate a tree of potential queries. Each branch leads to an agent performing a specific task. These agents communicate via prompts.",
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
