/* eslint-disable @typescript-eslint/no-explicit-any */
export const ticketResponse: any = {
  id: "12345",
  query: "list all issues related to pdf",
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
        objects: ["list all issues related to pdf"],
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
            text: "I will now query the `Example_verba_github_issues` collection to find issues related to PDF.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-3e3050ba-5218-4b5f-932f-cfb5acf64473",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "a5ef6d74-3e72-48c1-b634-21d1b9bf993e",
      query_id: "ac4fc4a7-37c6-4ad6-aab0-74eba49b8930",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: 'I\'m performing a keyword search for "pdf" within the `issue_content` of the `Example_verba_github_issues` collection.',
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
        type: "ticket",
        objects: [
          {
            created_at: "2024-10-31T03:29:51Z",
            content:
              '## Installation\r\n- [x] pip install goldenverba\r\n- [ ] pip install from source\r\n- [ ] Docker installation\r\nIf you installed via pip, please specify the version:\r\n## Weaviate Deployment\r\n- [x] Local Deployment\r\n- [ ] Docker Deployment\r\n- [ ] Cloud Deployment\r\n## Configuration\r\nReader:\r\nChunker:Token\r\nEmbedder:OPENAI-text_embedding-3-small\r\nRetriever:\r\nGenerator:\r\n## Additional context\r\nWhen I select to upload the parsed file,if the pdf is small, it can be uploaded normally. If the pdf is large, it returns "Unexpected error: TimeoutError -".How can I set the value of this Timeout?\r\nThe error message is as follows:\r\n```text\r\nℹ Removing abc.pdf from BatchManager\r\nℹ Found existing Client\r\nℹ STARTING | abc.pdf | Starting Import | 0\r\nℹ Loading abc.pdf (pdf)\r\nℹ LOADING | abc.pdf | Loaded abc.pdf | 5.96\r\nℹ CHUNKING | abc.pdf |  | 0\r\nℹ CHUNKING | abc.pdf | Split abc.pdf into 89 chunks | 0.02\r\nℹ EMBEDDING | abc.pdf |  | 0\r\nℹ Vectorizing 89 chunks in 1 batches\r\n✘ Unexpected error: TimeoutError -\r\nℹ ERROR | abc.pdf | Import for abc.pdf failed: Batch vectorization\r\nfailed: Vectorization failed for some batches:  | 31.82\r\n✘ No documents imported 0 of 1 succesful tasks\r\nℹ ERROR | abc.pdf | Import for abc.pdf failed: Import for abc.pdf\r\nfailed: Batch vectorization failed: Vectorization failed for some batches:  |\r\n0\r\n```\r',
            tags: ["investigating"],
            id: 2625892189,
            url: "https://github.com/weaviate/Verba/issues/312",
            comments: 1,
            title: "How can I set the value of this Timeout?",
            status: "open",
            updated_at: "2024-12-07T16:59:53Z",
            author: "ccutyear",
            uuid: "cc7936ac-8506-5f03-b722-c04e5411dcde",
            _REF_ID: "query_Example_verba_github_issues_0_0",
          },
          {
            created_at: "2024-12-27T06:00:03Z",
            content:
              "## Installation\r\n- [x] pip install goldenverba\r\n- [ ] pip install from source\r\n- [ ] Docker installation\r\nIf you installed via pip, please specify the version:\r\n## Weaviate Deployment\r\n- [ ] Local Deployment\r\n- [ ] Docker Deployment\r\n- [ ] Cloud Deployment\r\n## Configuration\r\nReader:\r\nChunker:\r\nEmbedder:\r\nRetriever:\r\nGenerator:\r\n## Additional context\r",
            tags: ["investigating"],
            id: 2760440189,
            url: "https://github.com/weaviate/Verba/issues/357",
            comments: 3,
            title:
              "Import for Unit_5.pdf failed: Import for Unit_5.pdf failed: Batch vectorization failed: Vectorization failed for some batches: ",
            status: "open",
            updated_at: "2025-01-15T10:25:24Z",
            author: "gokulcoder7",
            uuid: "9d23661d-5d5f-5492-be32-98b58ad6a647",
            _REF_ID: "query_Example_verba_github_issues_0_1",
          },
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
            updated_at: "2023-11-13T09:25:57Z",
            author: "vincentmin",
            uuid: "472a9a45-4aee-50c7-ac04-dcf8b79e050c",
            _REF_ID: "query_Example_verba_github_issues_0_2",
          },
          {
            created_at: "2023-12-30T17:28:56Z",
            content:
              "I've tried both:\r\npip install goldenverba\r\n... and:\r\ngit clone https://github.com/weaviate/Verba\r\npip install -e .\r\nFor both SimpleReader and PDFReader the following occurs ... not even a one line text file will load.\r\n..................................... from Terminal output:\r\n✔ Saved Config\r\nℹ Received Data to Import: READER(SimpleReader, Documents 1, Type\r\nDocumentation) CHUNKER (TokenChunker, UNITS 250, OVERLAP 50), EMBEDDER\r\n(ADAEmbedder)\r\n✔ Loaded 1 documents\r\nChunking documents: 100%|████████████████████████████████████████████████████| 1/1 [00:00<00:00, 13662.23it/s]\r\n✔ Chunking completed\r\nℹ (1/1) Importing document cls.txt with 1 batches\r\n✘ {'errors': {'error': [{'message': 'store is read-only'}]}, 'status':\r\n'FAILED'}\r\nImporting batches:   0%|                                                                | 0/1 [00:00<?, ?it/s]✘ {'errors': {'error': [{'message': 'store is read-only'}]}, 'status':\r\n'FAILED'}\r\nImporting batches: 100%|████████████████████████████████████████████████████████| 1/1 [00:00<00:00,  2.56it/s]\r\n✘ Loading data failed Document df91e789-78cd-4a99-970f-c9f0074a8932 not\r\nfound None\r\nINFO:     127.0.0.1:52222 - \"POST /api/load_data HTTP/1.1\" 200 OK\r\n.....................................\r\nDid I miss something?  I followed 2 youtube videos, and the simple install on the github.\r\nI do see usage on OpenAIs API page = 2 cents.\r",
            tags: [],
            id: 2060807258,
            url: "https://github.com/weaviate/Verba/issues/103",
            comments: 6,
            title: "No text/pdf will load using SimpleReader or PDFReader",
            status: "closed",
            updated_at: "2024-03-22T12:15:05Z",
            author: "cleesmith",
            uuid: "3e4c3838-a27b-53f2-944b-278b6b20ae05",
            _REF_ID: "query_Example_verba_github_issues_0_3",
          },
          {
            created_at: "2025-01-06T21:58:29Z",
            content:
              "## Description\r\nThe current version of Verba uses  @react-pdf/renderer@3.4.4 which consumes legacy-swc helpers (@react-pdf/renderer@3.4.4 › @react-pdf/font@2.5.1 › fontkit@2.0.2 › @swc/helpers@0.4.36 › legacy-swc-helpers@0.4.14). This library has a severe vulnerability which would need to be addressed before being able to trust the overall project.\r\nSnyk Report for Issues: https://security.snyk.io/vuln/SNYK-JS-LEGACYSWCHELPERS-7647380\r\nReact PDF Issue: https://github.com/diegomura/react-pdf/issues/2839\r\n## Installation\r\nN/A\r\nIf you installed via pip, please specify the version:\r\n## Weaviate Deployment\r\nN/A\r\n## Steps to Reproduce\r\nRun a vulnerability scan on the repro (in this case Snyk). This vulnerability will be shown.\r\n## Additional context\r",
            tags: ["investigating"],
            id: 2771516920,
            url: "https://github.com/weaviate/Verba/issues/361",
            comments: 1,
            title: "Critical Vulnerability in React PDF",
            status: "open",
            updated_at: "2025-02-28T11:47:26Z",
            author: "levisiebensecfx",
            uuid: "abe66b08-2207-59d3-9b69-82b9bc56f7c8",
            _REF_ID: "query_Example_verba_github_issues_0_4",
          },
        ],
        metadata: {
          collection_name: "Example_verba_github_issues",
          display_type: "ticket",
          needs_summarising: false,
          query_text: "pdf",
          query_type: "keyword",
          chunked: false,
          query_output: {
            target_collections: ["Example_verba_github_issues"],
            search_type: "keyword",
            search_query: "pdf",
            sort_by: null,
            filter_buckets: null,
            limit: 5,
          },
          code: {
            language: "python",
            title: "Query",
            text: "collection.query.bm25(\n    query='pdf',\n    limit=5\n)",
          },
        },
        code: {
          language: "python",
          title: "Query",
          text: "collection.query.bm25(\n    query='pdf',\n    limit=5\n)",
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
            text: "I will now summarize the issues related to PDF that I found in the `Example_verba_github_issues` collection.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-178f90a6-b52b-49e9-a3b4-933a53244cb2",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "a5ef6d74-3e72-48c1-b634-21d1b9bf993e",
      query_id: "ac4fc4a7-37c6-4ad6-aab0-74eba49b8930",
      payload: {
        type: "text_with_citations",
        metadata: {
          title: "Summary of PDF-related Issues in Verba",
        },
        objects: [
          {
            text: "There are several open and closed issues related to PDF files in the Verba project.\n\n",
            ref_ids: [],
          },
          {
            text: "One issue reports a timeout error when uploading large PDF files, suggesting a need to adjust timeout settings. ",
            ref_ids: ["query_Example_verba_github_issues_0_0"],
          },
          {
            text: "Another reports a failure during import of a PDF file due to batch vectorization issues.",
            ref_ids: ["query_Example_verba_github_issues_0_1"],
          },
          {
            text: "A feature request suggests adding native support for PDF files, including displaying them in the UI with highlighted sections, to avoid losing formatting and images when converting them to text. ",
            ref_ids: ["query_Example_verba_github_issues_0_2"],
          },
          {
            text: "One user reported issues loading any text or PDF files using SimpleReader or PDFReader, encountering a 'store is read-only' error. ",
            ref_ids: ["query_Example_verba_github_issues_0_3"],
          },
          {
            text: "Additionally, a critical vulnerability was identified in React PDF, a dependency used by Verba, which needs to be addressed to ensure the project's security.",
            ref_ids: ["query_Example_verba_github_issues_0_4"],
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
          "Are there any resolved PDF issues that might offer solutions?",
          "Can you list the authors who reported PDF issues?",
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
