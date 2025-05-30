/* eslint-disable @typescript-eslint/no-explicit-any */
export const VerbaResponse: any = {
  id: "12345",
  query: "What is Verba?",
  messages: [
    {
      type: "User",
      id: "36241ec2-3a1c-497b-b697-5631e2694480",
      query_id: "70971527-63f2-404f-8aca-11a7c41cab1f",
      conversation_id: "dad2e092-61ba-45d9-9307-35947c3469c5",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["What is Verba?"],
      },
    },
    {
      type: "text",
      conversation_id: "dad2e092-61ba-45d9-9307-35947c3469c5",
      query_id: "70971527-63f2-404f-8aca-11a7c41cab1f",
      id: "tex-3a759a2a-35d3-4678-819d-964da7bc903a",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: 'I will query the available datasets to find information related to "Verba."',
          },
        ],
      },
    },
    {
      type: "text",
      conversation_id: "dad2e092-61ba-45d9-9307-35947c3469c5",
      query_id: "70971527-63f2-404f-8aca-11a7c41cab1f",
      id: "tex-1b66e997-a70b-4e9c-b002-5e6a473c767c",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'll search the example_verba_github_issues collection using a semantic search to provide a summary of what Verba is.",
          },
        ],
      },
    },
    {
      type: "text",
      conversation_id: "dad2e092-61ba-45d9-9307-35947c3469c5",
      query_id: "70971527-63f2-404f-8aca-11a7c41cab1f",
      id: "tex-86583209-1953-4393-afc8-dcf4fe9a8c73",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'm now generating summaries for each issue, focusing on the title, author, and number of comments for easy readability.",
          },
        ],
      },
    },
    {
      type: "result",
      conversation_id: "dad2e092-61ba-45d9-9307-35947c3469c5",
      query_id: "70971527-63f2-404f-8aca-11a7c41cab1f",
      id: "res-bc03c61c-1339-4a2a-9212-314d67c5328f",
      payload: {
        type: "document",
        objects: [
          {
            collection_name: "example_verba_github_issues",
            content: "NaN",
            date: "2024-05-17T15:20:52Z",
            title: "Fix https://github.com/weaviate/Verba/issues/162",
            author: "hholtmann",
            category: [],
            uuid: "60c0be46eb9358318ebcb189c5452215",
            summary:
              "Issue #163 (closed) by hholtmann: Fix https://github.com/weaviate/Verba/issues/162",
            chunk_spans: [],
          },
          {
            collection_name: "example_verba_github_issues",
            content: "NaN",
            date: "2023-10-20T06:54:17Z",
            title: "Remove Unnececary imports",
            author: "agi-dude",
            category: [],
            uuid: "a72ff03d1015507b87b43207e3006121",
            summary:
              "Issue #27 (closed) by agi-dude: Remove Unnececary imports (4 comments)",
            chunk_spans: [],
          },
          {
            collection_name: "example_verba_github_issues",
            content: "NaN",
            date: "2024-09-10T21:14:41Z",
            title: "this is v2",
            author: "RyanLisse",
            category: [],
            uuid: "4d7c71af5dc95ee5a2d1b75a7d5447c6",
            summary: "Issue #281 (closed) by RyanLisse: this is v2 (1 comment)",
            chunk_spans: [],
          },
          {
            collection_name: "example_verba_github_issues",
            content: "NaN",
            date: "2024-07-01T09:47:05Z",
            title: "Add more SentenceTransformers (PR #152)",
            author: "thomashacker",
            category: [],
            uuid: "c8e85dc0b00d54fd96dd3253f139b256",
            summary:
              "Issue #234 (closed) by thomashacker: Add more SentenceTransformers (PR #152)",
            chunk_spans: [],
          },
          {
            collection_name: "example_verba_github_issues",
            content: "NaN",
            date: "2024-05-20T01:52:41Z",
            title: "N",
            author: "Jannice89",
            category: [],
            uuid: "3301494c93625e2ea39234579274fe1f",
            summary: "Issue #176 (closed) by Jannice89: N",
            chunk_spans: [],
          },
        ],
        metadata: {
          collection_name: "example_verba_github_issues",
          return_type: "document",
          output_type: "summary",
          query_text: "Verba",
          query_type: "semantic",
          code: {
            language: "python",
            title: "Query",
            text: "collection.query.near_text(query='Verba', limit=5)",
          },
          chunked: false,
        },
        code: {
          language: "python",
          title: "Query",
          text: "collection.query.near_text(query='Verba', limit=5)",
        },
      },
    },
    {
      type: "text",
      conversation_id: "dad2e092-61ba-45d9-9307-35947c3469c5",
      query_id: "70971527-63f2-404f-8aca-11a7c41cab1f",
      id: "tex-07cdee1c-1fd2-4153-b375-633b2c26adfc",
      payload: {
        type: "summary",
        metadata: {},
        objects: [
          {
            text: "Verba is a collaborative software project on GitHub related to Weaviate, focusing on various enhancements and bug fixes. Recent closed issues include efforts to fix specific problems, such as addressing a previous issue, removing unnecessary imports, and adding more SentenceTransformers. The project reflects active maintenance and contributions from multiple developers, indicating its ongoing evolution and improvement.",
            title: "Overview of Verba",
          },
        ],
      },
    },
  ],
  finished: true,
  query_start: new Date(),
  query_end: new Date(new Date().getTime() + 1000),
  NER: {
    text: "What is Verba?",
    noun_spans: [],
    entity_spans: [[8, 13]],
  },
  feedback: 1,
  index: 0,
};
