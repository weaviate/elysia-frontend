/* eslint-disable @typescript-eslint/no-explicit-any */
export const ticketResponse: any = {
  id: "12345",
  query: "list all issues related to pdf",
  messages: [
    {
      type: "User",
      id: "480dcadf-a7c0-48be-a5c1-b4fd490ef96f",
      query_id: "aa21db2e-faf0-40ed-a510-3ddcdb3936cb",
      conversation_id: "b18a97cc-32d4-476a-bd81-a74a7e8b81a0",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["list all issues related to pdf"],
      },
    },
    {
      type: "text",
      id: "tex-0ba9929a-63aa-491a-83c0-63cea15fd637",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b18a97cc-32d4-476a-bd81-a74a7e8b81a0",
      query_id: "aa21db2e-faf0-40ed-a510-3ddcdb3936cb",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will now search the GitHub issues collection for any issues related to PDF.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-4597de63-79c5-4ec4-8e4a-b84b0b5ad616",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b18a97cc-32d4-476a-bd81-a74a7e8b81a0",
      query_id: "aa21db2e-faf0-40ed-a510-3ddcdb3936cb",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: 'I\'m performing a hybrid search on the `issue_content` field of the `Example_verba_github_issues` collection to find issues related to "pdf".',
          },
        ],
      },
    },
    {
      type: "result",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b18a97cc-32d4-476a-bd81-a74a7e8b81a0",
      query_id: "aa21db2e-faf0-40ed-a510-3ddcdb3936cb",
      id: "res-b5592043-901f-4ece-b3ed-14df755fa773",
      payload: {
        type: "ticket",
        objects: [
          {
            created_at: "2023-09-19T11:10:28Z",
            content:
              "This is a feature request to add native support for PDF files.\r\nMy understanding is that Verba currently only handles text files such as `.txt` and `.md`. We can convert PDF files to text files to use them with Verba, but this will remove images and affect formatting. It would be great if we can load `.pdf` files directly into Verba and for the UI to display the PDF file with highlighted sections.\r\nSince many other file formats can be converted to PDF without losing their formatting, this would greatly expand the use cases of Verba.",
            tags: ["enhancement"],
            id: 1902738659,
            url: "https://github.com/weaviate/Verba/issues/18",
            comments: 2,
            title: "Load and display PDF files",
            status: "closed",
            author: "vincentmin",
            updated_at: "2023-11-13T09:25:57Z",
            uuid: "472a9a45-4aee-50c7-ac04-dcf8b79e050c",
          },
          {
            created_at: "2023-11-25T00:04:21Z",
            content:
              "Hi there,\r\nI have been working on PDF extraction for some time and nothing beats the Adobe service (well as you know they are the one who invented it).\r\nSDK is here: https://developer.adobe.com/document-services/docs/overview/pdf-extract-api/gettingstarted/#sdk\r\nYou get 500 documents per month on free tier so lots of people will enjoy.\r\nPS:\r\nI am not affiliated to Adobe in any way.\r",
            tags: ["enhancement"],
            id: 2010348152,
            url: "https://github.com/weaviate/Verba/issues/59",
            comments: 2,
            title: "Add Adobe PDF Extract API",
            status: "closed",
            author: "priamai",
            updated_at: "2024-05-15T17:35:16Z",
            uuid: "9b105160-29a7-56c5-b30d-ed7332f97a6b",
          },
          {
            created_at: "2024-02-21T19:57:53Z",
            content:
              "Hi Guys,\r\nI am trying to import a .pdf which has the size of 7.7MB.\r\nI've tried using the different settings but have been unable to import. I'm currently using the Token Chunker with 250 units and an overlap of 50.\r\nChunk mismatch for 3c161a37-d99a-4f2c-9c54-a7db5275e217 0 != 4527\r\n[Site Reliability Engineering.pdf](https://github.com/weaviate/Verba/files/14364353/Site.Reliability.Engineering.pdf)\r",
            tags: ["investigating"],
            id: 2147571080,
            url: "https://github.com/weaviate/Verba/issues/117",
            comments: 12,
            title: "Running into import errors",
            status: "closed",
            author: "moefarag1",
            updated_at: "2024-09-03T11:08:01Z",
            uuid: "e51c7b54-a6eb-57ae-9489-0b8b1ea31912",
          },
          {
            created_at: "2023-12-02T18:03:25Z",
            content:
              'when importing a PDF, I received the same error "Document xxx is none" independent of the error (no quota in openai api, no openai api setup, pdf greater that ada embedder supports, etc). I was able to check it through the logs, but I think that this should be solved\r\nRegards.',
            tags: [],
            id: 2022148056,
            url: "https://github.com/weaviate/Verba/issues/82",
            comments: 0,
            title: "No clear errors",
            status: "closed",
            author: "micuentadecasa",
            updated_at: "2024-04-11T10:39:11Z",
            uuid: "60f57aa4-5e82-5b3a-8624-9479a218f699",
          },
          {
            created_at: "2023-11-22T20:46:20Z",
            content:
              'When trying to import larger PDF files (tested with upwards of 20 pages) using ADAEmbedder I\'m seeing the following error in the front end and in the console.\r\nHowever the embeddings somehow seem to be generated since asking questions for that context works. But the uploaded document isn\'t showing in the frontend under the documents section.\r\n<img width="1302" alt="frontend" src="https://github.com/weaviate/Verba/assets/141818514/45d1ce2b-4b54-4ad4-9eb8-7eb6a184574c">\r\n<img width="749" alt="console" src="https://github.com/weaviate/Verba/assets/141818514/936436f5-5b76-4cfc-baca-c0520b0fc5d4">\r',
            tags: ["bug"],
            id: 2007092462,
            url: "https://github.com/weaviate/Verba/issues/50",
            comments: 9,
            title: "Error when importing larger PDF files",
            status: "closed",
            author: "duob-ai",
            updated_at: "2023-12-07T10:59:23Z",
            uuid: "846d3c30-ea75-5387-b1a3-4c33c44617b0",
          },
        ],
        metadata: {
          collection_name: "Example_verba_github_issues",
          display_type: "ticket",
          needs_summarising: false,
          query_text: "pdf",
          query_type: "hybrid",
          chunked: false,
          query_output: {
            target_collections: ["Example_verba_github_issues"],
            search_type: "hybrid",
            search_query: "pdf",
            sort_by: null,
            filter_buckets: null,
            limit: 5,
          },
          code: {
            language: "python",
            title: "Query",
            text: "collection.query.hybrid(\n    query='pdf',\n    limit=5\n)",
          },
        },
        code: {
          language: "python",
          title: "Query",
          text: "collection.query.hybrid(\n    query='pdf',\n    limit=5\n)",
        },
      },
    },
    {
      type: "text",
      id: "tex-1d49e9ca-8b95-44c9-861e-0885ed315533",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b18a97cc-32d4-476a-bd81-a74a7e8b81a0",
      query_id: "aa21db2e-faf0-40ed-a510-3ddcdb3936cb",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I have found and summarised the GitHub issues related to PDF.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-e13bfb7b-66ce-4f33-8c08-364e889c793e",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b18a97cc-32d4-476a-bd81-a74a7e8b81a0",
      query_id: "aa21db2e-faf0-40ed-a510-3ddcdb3936cb",
      payload: {
        type: "text_with_citations",
        metadata: {
          title: "Issues related to PDF",
        },
        objects: [
          {
            text: "There is a feature request to add native support for PDF files, as Verba currently primarily handles text files. While PDFs can be converted to text, this conversion removes images and affects formatting. The request suggests loading `.pdf` files directly into Verba and displaying them with highlighted sections to expand Verba's use cases, as many file formats can be converted to PDF without losing formatting.",
            ref_ids: ["query_Example_verba_github_issues_0_0"],
          },
          {
            text: "The Adobe PDF Extract API was suggested as a solution for PDF extraction, noting that their service is highly effective. The API offers a free tier that allows for 500 documents per month.",
            ref_ids: ["query_Example_verba_github_issues_0_1"],
          },
          {
            text: "Users have reported import errors when trying to import PDF files, particularly larger ones. One user encountered a chunk mismatch error while using the Token Chunker with specific settings.",
            ref_ids: ["query_Example_verba_github_issues_0_2"],
          },
          {
            text: 'Users have reported a generic "Document xxx is none" error when importing PDFs, regardless of the specific cause (e.g., OpenAI API quota, API setup, PDF size limitations). It was suggested that this error reporting should be improved.',
            ref_ids: ["query_Example_verba_github_issues_0_3"],
          },
          {
            text: "An error occurs when importing larger PDF files using ADAEmbedder. Although embeddings seem to be generated and questions can be asked, the uploaded document does not appear in the documents section of the frontend.",
            ref_ids: ["query_Example_verba_github_issues_0_4"],
          },
        ],
      },
    },
  ],
  finished: true,
  query_start: new Date(),
  query_end: new Date(new Date().getTime() + 1000),
  NER: {
    text: "list all issues related to pdf",
    noun_spans: [],
    entity_spans: [],
  },
  feedback: 1,
  index: 0,
};
