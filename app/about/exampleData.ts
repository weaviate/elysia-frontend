/* eslint-disable @typescript-eslint/no-explicit-any */
export const example_verba_github_issues: any = {
  type: "result",
  conversation_id: "53ceb8da-6f51-4b67-ba61-5ffff7b4a406",
  query_id: "1e6a41d8-e8c9-45a0-bcd0-769dd7d365bc",
  id: "res-30c828ef-ff68-44e5-8f5d-16d8806905d8",
  payload: {
    type: "ticket",
    objects: [
      {
        created_at: "2024-10-31T03:29:51Z",
        content:
          '## Installation\r\n- [x] pip install goldenverba\r\n- [ ] pip install from source\r\n- [ ] Docker installation\r\nIf you installed via pip, please specify the version:\r\n## Weaviate Deployment\r\n- [x] Local Deployment\r\n- [ ] Docker Deployment\r\n- [ ] Cloud Deployment\r\n## Configuration\r\nReader:\r\nChunker:Token\r\nEmbedder:OPENAI-text_embedding-3-small\r\nRetriever:\r\nGenerator:\r\n## Additional context\r\nWhen I select to upload the parsed file,if the pdf is small, it can be uploaded normally. If the pdf is large, it returns "Unexpected error: TimeoutError -".How can I set the value of this Timeout?\r\nThe error message is as follows:\r\n```text\r\nℹ Removing abc.pdf from BatchManager\r\nℹ Found existing Client\r\nℹ STARTING | abc.pdf | Starting Import | 0\r\nℹ Loading abc.pdf (pdf)\r\nℹ LOADING | abc.pdf | Loaded abc.pdf | 5.96\r\nℹ CHUNKING | abc.pdf |  | 0\r\nℹ CHUNKING | abc.pdf | Split abc.pdf into 89 chunks | 0.02\r\nℹ EMBEDDING | abc.pdf |  | 0\r\nℹ Vectorizing 89 chunks in 1 batches\r\n✘ Unexpected error: TimeoutError -\r\nℹ ERROR | abc.pdf | Import for abc.pdf failed: Batch vectorization\r\nfailed: Vectorization failed for some batches:  | 31.82\r\n✘ No documents imported 0 of 1 succesful tasks\r\nℹ ERROR | abc.pdf | Import for abc.pdf failed: Import for abc.pdf\r\nfailed: Batch vectorization failed: Vectorization failed for some batches:  |\r\n0\r\n```\r',
        tags: [],
        id: 2625892189,
        url: "https://github.com/weaviate/Verba/issues/312",
        comments: 0,
        title: "How can I set the value of this Timeout?",
        subtitle: "",
        status: "open",
        author: "ccutyear",
        updated_at: "2024-10-31T03:31:13Z",
        uuid: "66585b3c39235c98a97035873519d368",
        summary: "",
      },
      {
        created_at: "2024-10-30T15:21:15Z",
        content: "so it works on mac",
        tags: [],
        id: 2624460971,
        url: "https://github.com/weaviate/Verba/pull/311",
        comments: 0,
        title: "Add linux/arm64 platform to docker build-and-push action",
        subtitle: "",
        status: "open",
        author: "dudanogueira",
        updated_at: "2024-10-30T15:21:15Z",
        uuid: "63f18fdc4c135fe79d2f3c56cc3581e1",
        summary: "",
      },
      {
        created_at: "2024-10-29T20:24:31Z",
        content:
          '## Description\r\nDear maintainers, if I understand correctly, Verba\'s local option makes use weaviate embedded. Which as of weaviate\'s documentation is still in experimental stages. Is it possible to migrate a vector database from weaviate embedded to the dockerized weaviate version?\r\n## Additional context\r\nI have installed `pip install weaviate-client`  in order to gain access to an embedded weaviate client, to perform a backup of my data following the basic tutorial.\r\n```\r\nimport weaviate\r\nfrom weaviate.embedded import EmbeddedOptions\r\nimport os\r\nclient = weaviate.WeaviateClient(\r\n    embedded_options=EmbeddedOptions(\r\n        additional_env_vars={\r\n            "ENABLE_MODULES": "backup-filesystem",\r\n            "BACKUP_FILESYSTEM_PATH": "/tmp/backups"\r\n        }\r\n    )\r\n    # Add additional options here (see Python client docs for syntax)\r\n)\r\nclient.connect()\r\n```\r\nHowever I\'m not sure where to proceed from there.\r\nThank you for your time.',
        tags: ["enhancement"],
        id: 2622254317,
        url: "https://github.com/weaviate/Verba/issues/310",
        comments: 0,
        title: "Export/backup database",
        subtitle: "",
        status: "open",
        author: "Wehzie",
        updated_at: "2024-10-29T20:40:24Z",
        uuid: "63dd783f2f9f59a69d4906b0d10ad8ab",
        summary: "",
      },
      {
        created_at: "2024-10-26T23:31:56Z",
        content:
          "## Description\r\nDoes this support ingesting existing metadata on PDFs or does it all have to be manual? Can you embed images/use VLM's? does it link back to the original source file if stored in the same location? how do you remove things from the database/update saved locations/re-embed after something is deleted? is there a way to change the size of the points in the 3d view? mapplotlib may be good to integrate instead of the 3d visual. also, is there a way to merge embeddings if you previously embedded so you dont have to redo it?\r\n## Additional context\r\nsorry, a lot of questions",
        tags: ["enhancement"],
        id: 2616208614,
        url: "https://github.com/weaviate/Verba/issues/309",
        comments: 0,
        title: "Bunch of Questions",
        subtitle: "",
        status: "open",
        author: "kllgjc",
        updated_at: "2024-10-26T23:31:56Z",
        uuid: "ee801cff04ac59f49ed17e8fb39e9bcb",
        summary: "",
      },
      {
        created_at: "2024-10-24T10:19:45Z",
        content:
          "## Description\r\nCan't run Verba on any other port than 8000. Using the --port flag doesn't help. Page loads with only background color, no content.\r\n## Installation\r\n- [ ] pip install goldenverba\r\n- [x] pip install from source\r\n- [ ] Docker installation\r\n## Weaviate Deployment\r\n- [x] Local Deployment\r\n- [ ] Docker Deployment\r\n- [ ] Cloud Deployment\r\n## Steps to Reproduce\r\nTry running Verba on port 8001 using `verba start --port=8001`. Access localhost:8001 and page doesnt load.\r\n## Additional context\r\n-\r",
        tags: [],
        id: 2611130778,
        url: "https://github.com/weaviate/Verba/issues/308",
        comments: 0,
        title: "Verba won't start on any other port other than 8000",
        subtitle: "",
        status: "open",
        author: "bw-Deejee",
        updated_at: "2024-10-24T10:19:45Z",
        uuid: "7dc40c3473f853eba3e0a70dc0327251",
        summary: "",
      },
    ],
    metadata: {
      collection_name: "example_verba_github_issues",
      return_type: "ticket",
      output_type: "original",
      query_text: null,
      query_type: "fetch",
      code: {
        language: "python",
        title: "Query",
        text: 'collection.query.fetch_objects(\n    sort=Sort.by_property("issue_updated_at", ascending=False),\n    limit=5\n)',
      },
    },
    code: {
      language: "python",
      title: "Query",
      text: 'collection.query.fetch_objects(\n    sort=Sort.by_property("issue_updated_at", ascending=False),\n    limit=5\n)',
    },
  },
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export const example_verba_emails: any = {
  type: "result",
  conversation_id: "4c8e91c0-5f04-453c-a4f3-9a8b3644832c",
  query_id: "0b5c1b16-3536-4196-8e85-2cda9d8547df",
  id: "res-c82c7981-ab22-4734-a06f-c5e7f3e576bd",
  payload: {
    type: "conversation",
    metadata: {
      collection_name: "example_verba_slack_conversations",
      return_type: "conversation",
      output_type: "original",
      query_text: null,
      query_type: "fetch",
      code: {
        language: "python",
        title: "Query",
        text: 'collection.query.fetch_objects(\n    filters=Filter.by_property("conversation_id").equal(322.0),\n    limit=1\n)',
      },
    },
    objects: [
      {
        messages: [
          {
            conversation_id: 322,
            content:
              "Hey team, I see we're having some trouble with Verba. Can anyone fill me in on the errors being thrown?",
            author: "Fatima",
            timestamp: "2023-12-14T21:00:01Z",
            message_id: 0,
            uuid: "d2069e4f2d385d10b34bf256b5573d25",
            relevant: false,
          },
          {
            conversation_id: 322,
            content:
              "Yeah, I'm seeing a Syntax Error when trying to run a GraphQL query. The error message mentions an invalid character escape sequence.",
            author: "John",
            timestamp: "2023-12-14T21:05:15Z",
            message_id: 1,
            uuid: "6926fef4d58a568f88b341e66ca744f5",
            relevant: false,
          },
          {
            conversation_id: 322,
            content:
              "That sounds frustrating! Have we checked if there are any special characters in the query that might need escaping?",
            author: "Dalinar",
            timestamp: "2023-12-14T21:10:45Z",
            message_id: 2,
            uuid: "59c306788320519da1b41c5dae101985",
            relevant: false,
          },
          {
            conversation_id: 322,
            content:
              "Good point, Dalinar. Also, could we try simplifying the query to see if that resolves the issue?",
            author: "Fatima",
            timestamp: "2023-12-14T21:15:22Z",
            message_id: 3,
            uuid: "38a465cfca175ab4af5e3c5aa651603f",
            relevant: false,
          },
          {
            conversation_id: 322,
            content:
              "I can give that a shot! I’ll also double-check the Verba documentation for any notes on escaping characters.",
            author: "John",
            timestamp: "2023-12-14T21:18:35Z",
            message_id: 4,
            uuid: "f49d0c6c84925bfbbfaf73d47e52554f",
            relevant: false,
          },
          {
            conversation_id: 322,
            content:
              "Sounds like a plan! Let’s regroup after you’ve tried those options to see if anything changes.",
            author: "Dalinar",
            timestamp: "2023-12-14T21:20:50Z",
            message_id: 5,
            uuid: "72f95bba1cb15e5386fd59698950254b",
            relevant: true,
          },
        ],
        conversation_id: 322,
      },
    ],
    code: {
      language: "python",
      title: "Query",
      text: 'collection.query.fetch_objects(\n    filters=Filter.by_property("conversation_id").equal(322.0),\n    limit=1\n)',
    },
  },
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export const example_machine_learning_articles: any = {
  type: "result",
  conversation_id: "ae765e3b-8d54-4ca2-a6cb-680d4c672a6c",
  query_id: "63b5b2ac-a801-470c-ab1f-16310fe07d68",
  id: "res-490c6ac2-e9b9-4f27-a21c-ce8c3682c9e7",
  payload: {
    type: "document",
    objects: [
      {
        content:
          "Computational linguistics is an interdisciplinary field concerned with the computational modelling of natural language, as well as the study of appropriate computational approaches to linguistic questions. In general, computational linguistics draws upon linguistics, computer science, artificial intelligence, mathematics, logic, philosophy, cognitive science, cognitive psychology, psycholinguistics, anthropology and neuroscience, among others. == Origins == The field overlapped with artificial intelligence since the efforts in the United States in the 1950s to use computers to automatically translate texts from foreign languages, particularly Russian scientific journals, into English. Since rule-based approaches were able to make arithmetic (systematic) calculations much faster and more accurately than humans, it was expected that lexicon, morphology, syntax and semantics can be learned using explicit rules, as well. After the failure of rule-based approaches, David Hays coined the term in order to distinguish the field from AI and co-founded both the Association for Computational Linguistics (ACL) and the International Committee on Computational Linguistics (ICCL) in the 1970s and 1980s. What started as an effort to translate between languages evolved into a much wider field of natural language processing. == Annotated corpora == In order to be able to meticulously study the English language, an annotated text corpus was much needed. The Penn Treebank was one of the most used corpora. It consisted of IBM computer manuals, transcribed telephone conversations, and other texts, together containing over 4.5 million words of American English, annotated using both part-of-speech tagging and syntactic bracketing. Japanese sentence corpora were analyzed and a pattern of log-normality was found in relation to sentence length. == Modeling language acquisition == The fact that during language acquisition, children are largely only exposed to positive evidence, meaning that the only evidence for what is a correct form is provided, and no evidence for what is not correct, was a limitation for the models at the time because the now available deep learning models were not available in late 1980s. It has been shown that languages can be learned with a combination of simple input presented incrementally as the child develops better memory and longer attention span, which explained the long period of language acquisition in human infants and children. Robots have been used to test linguistic theories. Enabled to learn as children might, models were created based on an affordance model in which mappings between actions, perceptions, and effects were created and linked to spoken words. Crucially, these robots were able to acquire functioning word-to-meaning mappings without needing grammatical structure. Using the Price equation and Pólya urn dynamics, researchers have created a system which not only predicts future linguistic evolution but also gives insight into the evolutionary history of modern-day languages. == Chomsky's theories == Chomsky's theories have influenced computational linguistics, particularly in understanding how infants learn complex grammatical structures, such as those described in Chomsky normal form. Attempts have been made to determine how an infant learns a \"non-normal grammar\" as theorized by Chomsky normal form. Research in this area combines structural approaches with computational models to analyze large linguistic corpora like the Penn Treebank, helping to uncover patterns in language acquisition. == See also == == References == == Further reading == == External links == Association for Computational Linguistics (ACL) ACL Anthology of research papers ACL Wiki for Computational Linguistics CICLing annual conferences on Computational Linguistics Archived 2019-02-06 at the Wayback Machine Computational Linguistics – Applications workshop Free online introductory book on Computational Linguistics at the Wayback Machine (archived January 25, 2008) Language Technology World Resources for Text, Speech and Language Processing The Research Group in Computational Linguistics Archived 2013-08-01 at the Wayback Machine",
        date: "2025-01-31T15:33:58.043680Z",
        title: "Computational linguistics",
        author: "",
        category: [
          "Articles with short description",
          "Cognitive science",
          "Commons category link from Wikidata",
          "Computational fields of study",
          "Computational linguistics",
          "Formal sciences",
          "Short description is different from Wikidata",
          "Webarchive template wayback links",
        ],
        summary:
          "Computational linguistics is an interdisciplinary field concerned with the computational modelling of natural language, as well as the study of appropriate computational approaches to linguistic questions. In general, computational linguistics draws upon linguistics, computer science, artificial intelligence, mathematics, logic, philosophy, cognitive science, cognitive psychology, psycholinguistics, anthropology and neuroscience, among others.\n\n",
        collection_name: "ML_Wikipedia",
        chunk_spans: [
          {
            start: 931,
            end: 1736,
          },
          {
            start: 0,
            end: 1207,
          },
          {
            start: 1511,
            end: 2529,
          },
          {
            start: 3050,
            end: 4196,
          },
          {
            start: 4029,
            end: 4196,
          },
        ],
      },
    ],
    metadata: {
      collection_name: "ML_Wikipedia",
      return_type: "document",
      output_type: "original",
      query_text: "computational linguistics",
      query_type: "semantic",
      code: {
        language: "python",
        title: "Query",
        text: 'collection.query.near_text(\n    query="computational linguistics",\n    limit=5\n)',
      },
      chunked: true,
    },
    code: {
      language: "python",
      title: "Query",
      text: 'collection.query.near_text(\n    query="computational linguistics",\n    limit=5\n)',
    },
  },
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export const example_weaviate_documentation: any = {
  type: "result",
  conversation_id: "b33796ae-1ae4-408f-af48-47475cd69707",
  query_id: "340c340a-2ea2-4bb0-916b-6e373f00ef9c",
  id: "res-7108b6a0-67db-43de-850b-8cc52ef47985",
  payload: {
    type: "document",
    objects: [
      {
        title: "Weaviate Introduction",
        date: "",
        content:
          '\nWelcome to the documentation for **Weaviate**, an open source vector database.\n\n### About the docs\nThe content is grouped into categories by goals:\n\n| |How-to |References |Concepts |Tutorials |\n| ----- | ----- | ----- | ----- | ----- |\n| **Goal** | **Solve** a problem | Find **itemized** information | **Explanations** of topics | Guided **lessons** |\n\nCommonly requested resources such as\n- [Benchmarks](./benchmarks/index.md)\n- [Roadmap](./roadmap/index.md)\n\nHave their own sections, and others such as the\n\n- [FAQ](./more-resources/faq.md)\n- [Glossary](./more-resources/glossary.md)\n\nAnd more can be found in the [More Resources](./more-resources/index.md) section.\n\nThe Weaviate Cloud (WCD) documentation now has its own section! [Check it out here](../wcs/index.mdx).\n\n### For new users\n\nIf you are new to Weaviate, we recommend starting with these sections:\n1. Introduction (this page),\n2. [Quickstart tutorial](./quickstart/index.md)\n3. [Installation](./installation/index.md)\n4. [How-to: Configure](./configuration/index.md)\n\nWe suggest you browse through the [concepts](./concepts/index.md) section if you are interested in how Weaviate works.\n\nIf you have questions, visit our [forum](https://forum.weaviate.io) - we can help you with your specific problem, and help make the documentation better. Plus you\'ll meet our amazing, helpful community of users just like you!\n\nLike what you see? Consider giving us a [⭐ on GitHub](https://github.com/weaviate/weaviate/stargazers).\n\n### Code examples\n\nWhere possible, we show code examples in multiple programming languages using our [client libraries](./client-libraries/index.md). The following example shows you how to get a Weaviate collection definition using different clients.\n\n\n  \n    \n  \n\n  \n    \n  \n\n  \n    \n  \n\n  \n    \n  \n\n  \n    \n  \n\n  \n    \n  \n\n\n## About this page\n\nThis page is an introduction to Weaviate. We present a very high-level overview of Weaviate here, so that you have some context before moving on to any other sections.\n\n## What is Weaviate?\n\nWeaviate is an open source vector database that stores both objects and vectors. This allows for combining vector search with structured filtering.\n\n**Weaviate in a nutshell**:\n\n* Weaviate is an open source [vector database](https://weaviate.io/blog/what-is-a-vector-database).\n* Weaviate allows you to store and retrieve data objects based on their semantic properties by indexing them with [vectors](./concepts/vector-index.md).\n* Weaviate can be used stand-alone (aka _bring your vectors_) or with a variety of [modules](./modules/index.md) that can do the vectorization for you and extend the core capabilities.\n* Weaviate has a [GraphQL-API](./api/graphql/index.md) to access your data easily.\n* Weaviate is fast (check our [open source benchmarks](./benchmarks/index.md)).\n\n**Weaviate in detail**: Weaviate is a low-latency vector database with out-of-the-box support for different media types (text, images, etc.). It offers Semantic Search, Question-Answer Extraction, Classification, Customizable Models (PyTorch/TensorFlow/Keras), etc. Built from scratch in Go, Weaviate stores both objects and vectors, allowing for combining vector search with structured filtering and the fault tolerance of a cloud-native database. It is all accessible through GraphQL, REST, and various client-side programming languages.\n\n### Weaviate helps\n\n1. **Software Engineers** - Who use Weaviate as an ML-first database for their applications.\n    * Out-of-the-box modules for NLP / semantic search, automatic classification, and image similarity search.\n    * Easy to integrate with the current architecture, with full CRUD support like other OSS databases.\n    * Cloud-native, distributed, runs well on Kubernetes, and scales with one\'s workloads.\n\n2. **Data Engineers** - Who use Weaviate as a vector database that is built up from the ground with ANN at its core and with the same UX they love from Lucene-based search engines.\n    * Weaviate has a modular setup that allows you to use your ML models inside Weaviate. Due to its flexibility, you can also use out-of-the-box ML models (e.g., SBERT, ResNet, fasttext, etc.).\n    * Weaviate takes care of the scalability so that you don\'t have to.\n    * Deploy and maintain ML models in production reliably and efficiently.\n\n3. **Data Scientists** - Who use Weaviate for a seamless handover of their Machine Learning models to MLOps.\n    * Deploy and maintain your ML models in production reliably and efficiently.\n    * Weaviate\'s modular design allows you to package any custom-trained model you want easily.\n    * Smooth and accelerated handover of your Machine Learning models to engineers.\n\n## Features\n\nWeaviate makes it easy to use state-of-the-art AI models while providing the scalability, ease of use, safety and cost-effectiveness of a purpose-built vector database. Most notably:\n\n* **Fast queries**\n   Weaviate typically performs nearest neighbor (NN) searches of millions of objects in considerably less than 100ms. You can find more information on our [benchmark](./benchmarks/index.md) page.\n\n* **Ingest any media type with Weaviate Modules**\nUse State-of-the-Art AI model inference (e.g., Transformers) for accessing data (text, images, etc.) at search-and-query time to let Weaviate manage the process of vectorizing data for you - or provide your own vectors.\n\n* **Combine vector and scalar search**\n Weaviate allows for efficient, combined vector and scalar searches. For example, "articles related to the COVID-19 pandemic published within the past 7 days." Weaviate stores both objects and vectors and ensures the retrieval of both is always efficient. There is no need for a third-party object storage.\n\n* **Real-time and persistent**\nWeaviate lets you search through your data even if it\'s currently being imported or updated. In addition, every write is written to a Write-Ahead-Log (WAL) for immediately persisted writes - even when a crash occurs.\n\n* **Horizontal Scalability**\n  Scale Weaviate for your exact needs, e.g., maximum ingestion, largest possible dataset size, maximum queries per second, etc.\n\n* **High-Availability**\n  Is on our [roadmap](./roadmap/index.md) and will be released later this year.\n\n* **Cost-Effectiveness**\n  Very large datasets do not need to be kept entirely in-memory in Weaviate. At the same time, available memory can be used to increase the speed of queries. This allows for a conscious speed/cost trade-off to suit every use case.\n\n* **Graph-like connections between objects**\n  Make arbitrary connections between your objects in a graph-like fashion to resemble real-life connections between your data points. Traverse those connections using GraphQL.\n\n## How does Weaviate work?\n\nWithin Weaviate, all individual data objects are based on a class property structure where a vector represents each data object. You can connect data objects (like in a traditional graph) and search for data objects in the vector space.\n\nYou can add data to Weaviate through the [RESTful API](/developers/weaviate/api/rest) end-points and retrieve data through the [GraphQL interface](./api/graphql/index.md).\n\nWeaviate\'s [vector indexing mechanism is modular](./concepts/vector-index.md), and the current available plugin is the Hierarchical Navigable Small World (HNSW) multilayered graph.\n\n## What are Weaviate modules?\n\nWeaviate modules are used to extend Weaviate\'s capabilities and are optional. There are Weaviate modules that automatically vectorize your content (i.e., `*2vec`) or extend Weaviate\'s capabilities (often related to the type of vectors you have.) You can also create your own modules. Click [here](./concepts/modules.md) to learn more about them.\n\n## What is a vector database?\n\nIf you work with data, you probably work with search engine technology. The best search engines are amazing pieces of software, but because of their core architecture, they come with limitations when it comes to finding the data you are looking for.\n\nTake for example the data object: `{ "data": "The Eiffel Tower is a wrought iron lattice tower on the Champ de Mars in Paris." }`\n\nStoring this in a traditional search engine might leverage inverted indexes to index the data. This means that to retrieve the data, you need to search for "Eiffel Tower", "wrought iron lattice", or other exact phrases, to find it. But what if you have vast amounts of data, and you want the document about the Eiffel Tower, but you search for "landmarks in France"? Traditional search engines can\'t help you there, so this is where vector databases show their superiority.\n\nWeaviate uses vector indexing mechanisms at its core to represent the data. The vectorization modules (e.g., the NLP module) vectorize the above-mentioned data object in a vector-space where the data object sits _near_ the text "landmarks in France". This means that Weaviate can\'t find a 100% match, but it will find a very close one, and return the result.\n\nThe above example is for text (i.e., NLP), but you can use vector search for any machine learning model that vectorizes, like images, audio, video, genes, etc.\n\nTo learn more about vector databases, check out our [Gentle Introduction to Vector Databases](https://weaviate.io/blog/what-is-a-vector-database).\n\n## When should I use Weaviate?\n\nThere are four main situations when you should consider using Weaviate.\n\n- **If you don\'t like the quality of results that your current search engine gives you.** (With Weaviate you can search through your data semantically.)\n- **If you want to do textual and image similarity search with out-of-the-box state-of-the-art ML models.** (Combine storing and querying of multiple media types in one Weaviate instance.)\n- **If you want to combine semantic (vector) and scalar search with a vector database taking milliseconds.** (Weaviate stores both your objects and vectors and makes sure the retrieval of both is always efficient).\n- **If you need to scale your own machine learning models to production size.** (HNSW algorithm and horizontally scalable support near-realtime database operations)\n- **If you need to classify large datasets fast and near-realtime.** (kNN, zero-shot or contextual classification with out-of-the-box or custom ML models).\n\nPeople use Weaviate for cases such as semantic search, image search, similarity search, anomaly detection, power recommendation engines, e-commerce search, data classification in ERP systems, automated data harmonization, cybersecurity threat analysis, and many, many more cases.\n\n## Next Steps\n\nWant to get started or want to learn more? These resources might help you further:\n\n- Try out Weaviate:\n    - [Quickstart tutorial](./quickstart/index.md)\n- Learn about Weaviate:\n    - [Concepts](./concepts/index.md)\n\n\n## Questions and feedback\n\n\n',
        author: "",
        category: ["Documentation"],
        collection_name: "weaviate_documentation",
        chunk_spans: [
          {
            start: 2947,
            end: 3574,
          },
          {
            start: 3463,
            end: 3952,
          },
        ],
      },
      {
        title: "More-resources Faq",
        date: "",
        content:
          "\n\n## General\n\n#### Q: Why would I use Weaviate as my vector database?\n\n\n  Answer\n\n> Our goal is three-folded. Firstly, we want to make it as easy as possible for others to create their own semantic systems or vector search engines (hence, our APIs are GraphQL based). Secondly, we have a strong focus on the semantic element (the \"knowledge\" in \"vector databases,\" if you will). Our ultimate goal is to have Weaviate help you manage, index, and \"understand\" your data so that you can build newer, better, and faster applications. And thirdly, we want you to be able to run it everywhere. This is the reason why Weaviate comes containerized.\n\n\n\n#### Q: What is the difference between Weaviate and for example Elasticsearch?\n\n\n  Answer\n\n> Other database systems like Elasticsearch rely on inverted indexes, which makes search super fast. Weaviate also uses inverted indexes to store data and values. But additionally, Weaviate is also a vector-native search database, which means that data is stored as vectors, which enables semantic search. This combination of data storage is unique, and enables fast, filtered and semantic search from end-to-end.\n\n\n\n#### Q: Do you offer Weaviate as a managed service?\n\n\n  Answer\n\n> Yes, we do - check out [Weaviate Cloud](/pricing).\n\n\n\n## Configuration and setup\n\n#### Q: How should I configure the size of my instance?\n\n\n  Answer\n\n> You can find this in the [architecture section](/developers/weaviate/concepts/resources.md#an-example-calculation) of the docs.\n\n\n\n#### Q: Do I need to know about Docker (Compose) to use Weaviate?\n\n\n  Answer\n\n> Weaviate uses Docker images as a means to distribute releases and uses Docker Compose to tie a module-rich runtime together. If you are new to those technologies, we recommend reading the [Docker Introduction for Weaviate Users](https://medium.com/semi-technologies/what-weaviate-users-should-know-about-docker-containers-1601c6afa079).\n\n\n\n#### Q: What happens when the Weaviate Docker container restarts? Is my data in the Weaviate database lost?\n\n\n  Answer\n\n> There are three levels:\n> 1. You have no volume configured (the default in our `Docker Compose` files), if the container restarts (e.g. due to a crash, or because of `docker stop/start`) your data is kept\n> 2. You have no volume configured (the default in our `Docker Compose` files), if the container is removed (e.g. from `docker compose down` or `docker rm`) your data is gone\n> 3. If a volume is configured, your data is persisted regardless of what happens to the container. They can be completely removed or replaced, next time they start up with a volume, all your data will be there\n\n\n\n## Schema and data structure\n\n#### Q: Are there any 'best practices' or guidelines to consider when designing a schema?\n\n*(E.g. if I was looking to perform a semantic search over a the content of a Book would I look to have Chapter and Paragraph represented in the schema etc, would this be preferred over including the entire content of the novel in a single property?)*\n\n\n  Answer\n\n> As a rule of thumb, the smaller the units, the more accurate the search will be. Two objects of e.g. a sentence would most likely contain more information in their vector embedding than a common vector (which is essentially just the mean of sentences). At the same time more objects leads to a higher import time and (since each vector also makes up some data) more space. (E.g. when using transformers, a single vector is 768xfloat32 = 3KB. This can easily make a difference if you have millions, etc.) of vectors. As a rule of thumb, the more vectors you have the more memory you're going to need.\n>\n> So, basically, it's a set of tradeoffs. Personally we've had great success with using paragraphs as individual units, as there's little benefit in going even more granular, but it's still much more precise than whole chapters, etc.\n>\n> You can use cross-references to link e.g. chapters to paragraphs. Note that resolving a cross-references takes a performance penalty. Essentially resolving A1->B1 is the same cost as looking up both A1 and B1 indvidually. But at scale, this can add up.\n>\n> So, consider denormalizing your data, i.e. storing the data in a way that you can resolve the cross-references without actually looking them up. This is a common pattern in databases, and it's also a common pattern in Weaviate.\n\n\n\n#### Q: Should I use references in my schema?\n\n\n  Answer\n\n> In short: for convenience you can add relations to your data schema, because you need less code and queries to get data. But resolving references in queries takes some of the performance.\n>\n> 1. If your ultimate goal is performance, references probably don't add any value, as resolving them adds a cost.\n> 2. If your goal is represent complex relationships between your data items, they can help a lot. You can resolve references in a single query, so if you have collections with multiple links, it could definitely be helpful to resolve some of those connections in a single query. On the other hand, if you have a single (bi-directional) reference in your data, you could also just denormalize the links (e.g. with an ID field) and resolve them during search.\n\n\n\n#### Q: Is it possible to create one-to-many relationships in the schema?\n\n\n  Answer\n\n> Yes, it is possible to reference to one or more objects (Class -> one or more Classes) through cross-references. Referring to lists or arrays of primitives, this will be available [soon](https://github.com/weaviate/weaviate/issues/1611).\n\n\n\n#### Q: What is the difference between `text` and `string` and `valueText` and `valueString`?\n\n\n  Answer\n\n> The `text` and `string` datatypes differ in tokenization behavior. Note that `string` is now deprecated. Read more in [this section](../config-refs/schema/index.md#property-tokenization) on the differences.\n\n\n\n#### Q: Do Weaviate collections have namespaces?\n\n\n  Answer\n\nYes. Each collection itself acts like namespaces. Additionally, you can use the [multi-tenancy](../concepts/data.md#multi-tenancy) feature to create isolated storage for each tenant. This is especially useful for use cases where one cluster might be used to store data for multiple customers or users.\n\n\n\n#### Q: Are there restrictions on UUID formatting? Do I have to adhere to any standards?\n\n\n  Answer\n\n> The UUID must be presented as a string matching the [Canonical Textual representation](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format). If you don't specify a UUID, Weaviate will generate a `v4` i.e. a random UUID. If you generate them yourself you could either use random ones or deterministically determine them based on some fields that you have. For this you'll need to use [`v3` or `v5`](https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions_3_and_5_(namespace_name-based)).\n\n\n\n#### Q: If I do not specify a UUID during adding data objects, will Weaviate create one automatically?\n\n\n  Answer\n\n> Yes, Weaviate creates a UUID if one is not specified.\n\n\n\n\n#### Q: Why does Weaviate have a schema and not an ontology?\n\n\n  Answer\n\n> We use a schema because it focusses on the representation of your data (in our case in the GraphQL API) but you can use a Weaviate schema to express an ontology. One of Weaviate's core features is that it semantically interprets your schema (and with that your ontology) so that you can search for concepts rather than formally defined entities.\n\n\n\n#### Q: What is the difference between a Weaviate data schema, ontologies and taxonomies?\n\n\n  Answer\n\n> Read about how taxonomies, ontologies and schemas are related to Weaviate in [this blog post](https://medium.com/semi-technologies/taxonomies-ontologies-and-schemas-how-do-they-relate-to-weaviate-9f76739fc695).\n\n\n\n## Text and language processing\n\n#### Q: How to deal with custom terminology?\n\n\n  Answer\n\n> Sometimes, users work with custom terminology, which often comes in the form of abbreviations or jargon. You can find more information on how to use the endpoint [here](/developers/weaviate/modules/text2vec-contextionary.md#extending-the-contextionary-v1modulestext2vec-contextionaryextensions)\n\n\n\n#### Q: How can you index data near-realtime without losing semantic meaning?\n\n\n  Answer\n\n> Every data object [gets its vector representation](../) based on its semantic meaning. In a nutshell, we calculate the vector position of the data object based on the words and concepts used in the data object. The existing model in the contextionary gives already enough context. If you want to get in the nitty-gritty, you can [browse the code here](https://github.com/weaviate/contextionary/tree/master/server), but you can also ask a [specific question on Stackoverflow](https://stackoverflow.com/tags/weaviate/) and tag it with Weaviate.\n\n\n\n#### Q: Why isn't there a text2vec-contextionary in my language?\n\n\n  Answer\n\n> Because you are probably one of the first that needs one! Ping us [here on GitHub](https://github.com/weaviate/weaviate/issues), and we will make sure in the next iteration it will become available (unless you want it in [Silbo Gomero](https://en.wikipedia.org/wiki/Silbo_Gomero) or another language which is whistled).\n\n\n\n#### Q: How do you deal with words that have multiple meanings?\n\n\n  Answer\n\n> How can Weaviate interpret that you mean a company, as in business, and not as the division of the army? We do this based on the structure of the schema and the data you add. A schema in Weaviate might contain a company collection with the property name and the value Apple. This simple representation (company, name, apple) is already enough to gravitate the vector position of the data object towards businesses or the iPhone. You can read [here](../) how we do this, or you can ask a specific question on [Stackoverflow](https://stackoverflow.com/tags/weaviate/) and tag it with Weaviate.\n\n\n\n#### Q: Is there support to multiple versions of the query/document embedding models to co-exist at a given time? (helps with live experiments of new model versions)\n\n\n  Answer\n\n> You can create multiple collections in the Weaviate schema, where one collection will act like a namespace in Kubernetes or an index in Elasticsearch. So the spaces will be completely independent, this allows space 1 to use completely different embeddings from space 2. The configured vectorizer is always scoped only to a single collection. You can also use Weaviate's Cross-Reference features to make a graph-like connection between an object of Class 1 to the corresponding object of Class 2 to make it easy to see the equivalent in the other space.\n\n\n\n## Queries\n\n#### Q: How can I retrieve the total object count in a collection?\n\n\n  Answer\n\n> This `Aggregate` query returns the total object count in a collection.\n\n\n\n\n\n#### Q: How do I get the cosine similarity from Weaviate's certainty?\n\n\n  Answer\n\n> To obtain the [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) from weaviate's `certainty`, you can do `cosine_sim = 2*certainty - 1`\n\n\n\n#### Q: The quality of my search results change depending on the specified limit. Why? How can I fix this?\n\n\n  Answer\n\nWeaviate makes use of ANN indexes to serve vector searches. An ANN index is an approximate nearest neighbor index. The \"approximate\" part refers to an explicit recall-query-speed tradeoff. This trade-off is presented in detail in the [ANN benchmarks section](/developers/weaviate/benchmarks/ann.md#results). For example, a 98% recall for a given set of HNSW parameters means that 2% of results will not match the true nearest neighbors. What build parameters lead to what recall depends on the dataset used. The benchmark pages shows 4 different example datasets. Based on the characteristic of each dataset you can pick the one closest to your production load and draw conclusions about the expected recall for the respective build and query-time parameters.\n\nGenerally if you need a higher recall than the default parameters provide you with, you can use stronger parameters. This can either be done at build time (`efConstruction`, `maxConnections`) or at query time (`ef`). Roughly speaking, a higher `ef` value at query time means a more thorough search. It will have a slightly higher latency, but also lead to a slightly better recall.\n\nBy changing the specified limit, you are implicitly changing the `ef` parameter. This is because the default `ef` value is set to `-1`, indicating that Weaviate should pick the parameter based on the limit. The dynamic `ef` value is controlled using the configuration fields `dynamicEfMin` which acts as a lower boundary, `dynamicEfMax` which acts as an upper boundary and `dynamicEfFactor` which is the factor to derive the target `ef` based on the limit within the lower and upper boundary.\n\nExample: Using the default parameters `ef=-1`, `dynamicEfMin=100`, `dynamicEfMax=500`, `dynamicEfFactor=8`, you will end up with the following `ef` values based on the limit:\n\n* `limit=1`, dynamically calculated: `ef=1*8=8`. This value is below the lower boundary, so `ef` is set to `100`.\n* `limit=20`, dynamically calculated: `ef=20*8=160`. This value is within the boundaries, so `ef` is `160`.\n* `limit=100`, dynamically calculated: `ef=100*8=800`. This value is above the upper boundary, so `ef` is set to `500`.\n\nIf you need a higher search quality for a given limit you can consider the following options:\n\n1. Instead of using a dynamic `ef` value, use a fixed one that provides the desired recall.\n1. If your search quality varies a lot depending on the query-time `ef` values, you should also consider choosing stronger build parameters. The [ANN benchmarks section](/developers/weaviate/benchmarks/ann.md#results) present a combination of many different parameter combination for various datasets.\n\n\n\n#### Q: Why did you use GraphQL instead of SPARQL?\n\n\n  Answer\n\n> For user experience. We want to make it as simple as possible to integrate Weaviate into your stack, and we believe that GraphQL is the answer to this. The community and client libraries around GraphQL are enormous, and you can use almost all of them with Weaviate.\n\n\n\n## Data management\n\n#### Q: What is the best way to iterate through objects? Can I do paginated API calls?\n\n\n  Answer\n\n> Yes, Weaviate supports cursor-based iteration as well as pagination through a result set.\n>\n> To iterate through all objects, you can use the [`after` operator](../manage-data/read-all-objects.mdx).\n>\n> For pagination through a result set, you can use the `offset` and `limit` operators for GraphQL API calls. Take a look at [this page](../api/graphql/filters.md#pagination-with-offset) which describes how to use these operators, including tips on performance and limitations.\n\n\n\n#### Q: What is best practice for updating data?\n\n\n  Answer\n\n> Here are top 3 best practices for updating data:\n> 1. Use the [batch API](../manage-data/import.mdx)\n> 2. Start with a small-ish batch size e.g. 100 per batch. Adjust up if it is very fast, adjust down if you run into timeouts\n> 3. If you have unidirectional relationships (e.g. `Foo -> Bar`.) it's easiest to first import all `Bar` objects, then import all `Foo` objects with the refs already set. If you have more complex relationships, you can also import the objects without references, then [add references](../manage-data/import.mdx#import-with-references) to set links between collections in arbitrary directions.\n\n\n\n## Modules\n\n#### Q: Can I connect my own module?\n\n\n  Answer\n\n> [Yes!](/developers/weaviate/modules/custom-modules.md)\n\n\n\n#### Q: Can I train my own text2vec-contextionary vectorizer module?\n\n\n  Answer\n\n> Not at the moment. You can currently use the [available contextionaries](/developers/weaviate/modules/text2vec-contextionary.md) in a variety of languages and use the transfer learning feature to add custom concepts if needed.\n\n\n\n## Indexes in Weaviate\n\n#### Q: Does Weaviate use Hnswlib?\n\n\n  Answer\n\n> No\n>\n> Weaviate uses a custom implementation of HNSW that overcomes certain limitations of [hnswlib](https://github.com/nmslib/hnswlib), such as durability requirements, CRUD support, pre-filtering, etc.\n>\n> Custom HNSW implementation in Weaviate references:\n>\n> - [HNSW plugin (GitHub)](https://github.com/weaviate/weaviate/tree/master/adapters/repos/db/vector/hnsw)\n> - [vector dot product ASM](https://github.com/weaviate/weaviate/blob/master/adapters/repos/db/vector/hnsw/distancer/asm/dot_amd64.s)\n>\n> More information:\n>\n> - [Weaviate, an ANN Database with CRUD support – DB-Engines.com](https://db-engines.com/en/blog_post/87) ⬅️ best resource on the topic\n> - [Weaviate's HNSW implementation in the docs](/developers/weaviate/concepts/vector-index.md#hnsw)\n>\n> _Note I: HNSW is just one implementation in Weaviate, but Weaviate can support multiple indexing algoritmns as outlined [here](/developers/weaviate/concepts/vector-index.md)_\n\n\n\n#### Q: Are all ANN algorithms potential candidates to become an indexation plugin in Weaviate?\n\n\n  Answer\n\n> No\n>\n> Some algorithms (e.g., Annoy or ScaNN) are entirely immutable once built, they can neither be changed nor built up incrementally. Instead, they require you to have all of your vectors present, then you build the algorithm once. After a build, you can only query them, but cannot add more elements or change existing elements. Thus, they aren't capable of the CRUD operations we want to support in Weaviate.\n\n\n\n#### Q: Does Weaviate use pre- or post-filtering ANN index search?\n\n\n  Answer\n\n> Weaviate currently uses pre-filtering exclusively on filtered ANN search.\n> See \"How does Weaviate's vector and scalar filtering work\" for more details.\n\n\n\n#### Q: How does Weaviate's vector and scalar filtering work?\n\n\n  Answer\n\n> It's a 2-step process:\n>\n> 1. The inverted index (which is [built at import time](#q-does-weaviate-use-hnswlib)) queries to produce an allowed list of the specified document ids. Then the ANN index is queried with this allow list (the list being one of the reasons for our custom implementation).\n> 2. If we encounter a document id which would be a close match, but isn't on the allow list the id is treated as a candidate (i.e. we add it to our list of links to evaluate), but is never added to the result set. Since we only add allowed IDs to the set, we don't exit early, i.e. before the top `k` elements are reached.\n>\n> For more information on the technical implementations, see [this video](https://www.youtube.com/watch?v=6hdEJdHWXRE).\n\n\n\n#### What is the maximum number of vector dimensions for embeddings?\n\n\n  Answer\n\n> As the embedding is currently stored using `uint16`, the maximum possible length is currently 65535.\n\n\n\n## Performance\n\n#### Q: What would you say is more important for query speed in Weaviate: More CPU power, or more RAM?\n\nMore concretely: If you had to pick between a machine that has 16 GB of RAM and 2 CPUs, or a machine that has 8 GB of RAM and 4 CPUs, which would you pick?\n\n\n  Answer\n\n> This is a very difficult to answer 100% correctly, because there are several factors in play:\n> * **The vector search itself**. This part is CPU-bound, however only with regards to throughput: A single search is single-threaded. Multiple parallel searches can use multiple threads. So if you measure the time of a single request (otherwise idle), it will be the same whether the machine has 1 core or 100. However, if your QPS approach the throughput of a CPU, you'll see massive benefits by adding more Cores\n> * **The retrieval of the objects**. Once the vector search part is done, we are essentially left with a list of n IDs which need to be resolved to actual objects. This is IO-bound in general. However, all disk files are memory-mapped. So generally, more mem will allow you to hold more of the disk state in memory. In real life however, it's not that simple. Searches are rarely evenly distributed. So let's pretend that 90% of searches will return just 10% of objects (because these are more popular search results). Then if those 10% of the disk objects are already cached in mem, there's no benefit in adding more memory.\n>\n> Taking the above in mind: we can carefully say: If throughput is the problem, increase CPU, if response time is the problem increase mem. However, note that the latter only adds value if there are more things that can be cached. If you have enough mem to cache your entire disk state (or at least the parts that are relevant for most queries), additional memory won't add any additional benefit.\n> If we are talking about imports on the other hand, they are almost always CPU-bound because of the cost of creating the HNSW index. So, if you can resize between import and query, my recommendation would be roughly prefer CPUs while importing and then gradually replace CPU with memory at query time - until you see no more benefits. (This assumes that there is a separation between importing and querying which might not always be the case in real life).\n\n\n\n#### Q: Data import takes long / is slow, what is causing this and what can I do?\n\n\n  Answer\n\n> HNSW is super fast at query time, but slower on vectorization. This means that adding and updating data objects costs relatively more time. You could try [asynchronous indexing](../config-refs/schema/vector-index.md#asynchronous-indexing), which separates data ingestion from vectorization.\n\n\n\n#### Q: How can slow queries be optimized?\n\n\n  Answer\n\n> Queries containing deeply nested references that need to be filtered or resolved can take some time. Read on optimization strategies [here](./performance.md#costs-of-queries-and-operations).\n\n\n\n\n#### Q: When scalar and vector search are combined, will the scalar filter happen before or after the nearest neighbor (vector) search?\n\n\n  Answer\n\n> The mixed structured vector searches in Weaviate are pre-filter. There is an inverted index which is queried first to basically form an allow-list, in the HNSW search the allow list is then used to treat non-allowed doc ids only as nodes to follow connections, but not to add to the result set.\n\n\n\n#### Q: Regarding \"filtered vector search\": Since this is a two-phase pipeline, how big can that list of IDs get? Do you know how that size might affect query performance?\n\n\n  Answer\n\n> Essentially the list ids uses the internal doc id which is a `uint64` or 8 bytes per ID. The list can grow as long as you have memory available. So for example with 2GB of free memory, it could hold 250M ids, with 20GB it could hold 2.5B ids, etc.\n>\n> Performance wise there are two things to consider:\n> 1. Building the lookup list\n> 2. Filtering the results when vector searching\n>\n> Building the list is a typical inverted index look up, so depending on the operator this is just a single read on == (or a set of range reads, e.g. for >7, we'd read the value rows from 7 to infinity). This process is pretty efficient, similar to how the same thing would happen in a traditional search engine, such as elasticsearch\n>\n> Performing the filtering during the vector search depends on whether the filter is very restrictive or very loose. In the case you mentioned where a lot of IDs are included, it will be very efficient. Because the equivalent of an unfiltered search would be the one where your ID list contains all possible IDs. So the HNSW index would behave normally. There is however, a small penalty whenever a list is present: We need to check if the current ID is contained an the allow-list. This is essentially a hashmap lookup, so it should be O(1) per object. Nevertheless, there is a slight performance penalty.\n>\n> Now the other extreme, a very restrictive list, i.e few IDs on the list, actually takes considerably more time. Because the HNSW index will find neighboring IDs, but since they're not contained, they cannot be added as result candidates, meaning that all we can do with them is evaluating their connections, but not the points themselves. In the extreme case of a list that is very, very restrictive, say just 10 objects out of 1B in the worst case the search would become exhaustive if you the filtered ids are very far from the query. In this extreme case, it would actually be much more efficient to just skip the index and do a brute-force indexless vector search on the 10 ids. So, there is a cut-off when a brute-force search becomes more efficient than a heavily-restricted vector search with HNSW. We do not yet have any optimization to discovery such a cut-off point and skip the index, but this should be fairly simple to implement if this ever becomes an actual problem.\n\n\n\n#### Q: My Weaviate instance uses more memory than I think is reasonable. How can I debug this?\n\n\n  Answer\n\n> Check that your import uses the latest version of Weaviate. `v1.12.0` and `v1.12.1` fix an [issue](https://github.com/weaviate/weaviate/issues/1868) where excessive amounts of data are written to disk, resulting in unreasonable memory consumption after restarts. If upgrading does not fix the issue, see this post on [how to profile memory use](https://stackoverflow.com/a/71793178/5322199).\n\n\n\n## Troubleshooting / debugging\n\n#### Q: How can I print a stack trace of Weaviate?\n\n\n  Answer\n\nYou can do this by sending a `SIGQUIT` signal to the process. This will print a stack trace to the console. The logging level and debugging variables can be set with `LOG_LEVEL` and `DEBUG` [environment variables](https://weaviate.io/developers/weaviate/config-refs/env-vars).\n\nRead more on SIGQUIT [here](https://en.wikipedia.org/wiki/Signal_(IPC)#SIGQUIT) and this [StackOverflow answer](https://stackoverflow.com/questions/19094099/how-to-dump-goroutine-stacktraces/35290196#35290196).\n\n\n\n## Miscellaneous\n\n#### Q: Can I request a feature in Weaviate?\n\n\n  Answer\n\n> Sure (also, feel free to [issue a pull request](https://github.com/weaviate/weaviate/pulls) 😉) you can [add those requests here](https://github.com/weaviate/weaviate/issues). The only thing you need is a GitHub account, and while you're there, make sure to give us a star 😇.\n\n\n\n#### Q: What is Weaviate's consistency model in a distributed setup?\n\n\n  Answer\n\n> Weaviate is generally modeled to prefer Availability over Consistency (AP over CP). It is designed to deliver low search latencies under high throughput in situations where availability is more business-critical than consistency. If strict serializability is required on your data, we generally recommend storing your data in a different primary data store, use Weaviate as an auxiliary data store, and set up replication between the two. If you do not need serializability and eventual consistency is enough for your use case, Weaviate can be used as a primary datastore.\n>\n> Weaviate has no notion of transactions, operations always affect exactly a single key, therefore Serializability is not applicable. In a distributed setup (under development) Weaviate's consistency model is eventual consistency. When a cluster is healthy, all changes are replicated to all affected nodes by the time the write is acknowledged by the user. Objects will immediately be present in search results on all nodes after the import request completes. If a search query occurs concurrently with an import operation nodes may not be in sync yet. This means some nodes might already include the newly added or updated objects, while others don't yet. In a healthy cluster, all nodes will have converged by the time the import request has been completed successfully. If a node is temporarily unavailable and rejoins a cluster it may temporarily be out of sync. It will then sync the missed changes from other replica nodes and eventually serve the same data again.\n\n\n\n#### Q: With your aggregations I could not see how to do time buckets, is this possible?\n\n\n  Answer\n\n> At the moment, we cannot aggregate over timeseries into time buckets yet, but architecturally there's nothing in the way. If there is demand, this seems like a nice feature request, you can submit an [issue here](https://github.com/weaviate/weaviate/issues). (We're a very small company though and the priority is on Horizontal Scaling at the moment.)\n\n\n\n#### Q: How can I run the latest master branch with Docker Compose?\n\n\n  Answer\n\n> You can run Weaviate with `Docker Compose`, you can build your own container off the [`master`](https://github.com/weaviate/weaviate) branch. Note that this is not an officially released Weaviate version, so this might contain bugs.\n>\n> ```sh\n> git clone https://github.com/weaviate/weaviate.git\n> cd weaviate\n> docker build --target weaviate -t name-of-your-weaviate-image .\n> ```\n>\n> Then, make a `docker-compose.yml` file with this new image. For example:\n>\n> ```yml\n>\n> services:\n>   weaviate:\n>     image: name-of-your-weaviate-image\n>     ports:\n>       - 8080:8080\n>     environment:\n>       CONTEXTIONARY_URL: contextionary:9999\n>       QUERY_DEFAULTS_LIMIT: 25\n>       AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'\n>       PERSISTENCE_DATA_PATH: './data'\n>       ENABLE_MODULES: 'text2vec-contextionary'\n>       AUTOSCHEMA_ENABLED: 'false'\n>   contextionary:\n>     environment:\n>       OCCURRENCE_WEIGHT_LINEAR_FACTOR: 0.75\n>       EXTENSIONS_STORAGE_MODE: weaviate\n>       EXTENSIONS_STORAGE_ORIGIN: http://weaviate:8080\n>       NEIGHBOR_OCCURRENCE_IGNORE_PERCENTILE: 5\n>       ENABLE_COMPOUND_SPLITTING: 'false'\n>     image: cr.weaviate.io/semitechnologies/contextionary:en0.16.0-v1.0.2\n> ```\n>\n> After the build is complete, you can run this Weaviate build with docker compose:\n\n```bash\ndocker compose up\n```\n\n\n\n## More questions?\n\n## Questions and feedback\n\n\n",
        author: "",
        category: ["Documentation"],
        collection_name: "weaviate_documentation",
        chunk_spans: [
          {
            start: 379,
            end: 1040,
          },
        ],
      },
      {
        title: "Hello_weaviate Intro_weaviate",
        date: "",
        content:
          "\n##  What is Weaviate?\n\nimport ReactPlayer from 'react-player/lazy'\n\n\n\n\nWeaviate is an open-source [vector database](https://weaviate.io/blog/what-is-a-vector-database). But what does that mean? Let's unpack it here.\n\n###  Vector database\n\nWeaviate is a fantastic tool for retrieving the information you need, quickly and accurately. It does this by being an amazing **vector database**.\n\nYou may be familiar with traditional databases such as relational databases that use SQL. A database can catalog, store and retrieve information. A **vector** database can carry out these tasks also, with the key difference being that they can perform these tasks based on similarity.\n\n####  How traditional searches work\n\nImagine that you are searching a relational database containing articles on cities, to retrieve a list of \"major\" European cities. Using SQL, you might construct a query like this:\n\n```sql\nSELECT city_name wiki_summary\nFROM wiki_city\nWHERE (wiki_summary LIKE '%major European city%' OR\n       wiki_summary LIKE '%important European city%' OR\n       wiki_summary LIKE '%prominent European city%' OR\n       wiki_summary LIKE '%leading European city%' OR\n       wiki_summary LIKE '%significant European city%' OR\n       wiki_summary LIKE '%top European city%' OR\n       wiki_summary LIKE '%influential European city%' OR\n       wiki_summary LIKE '%notable European city%')\n    (… and so on)\n```\n\nWhich would return cities that contained any of these strings (`major`, `important`, `prominent`, ... etc) in the `wiki_summary` column.\n\nThis works well in many circumstances. However, there are two significant limitations with this approach.\n\n####  Limitations of traditional search\n\nUsing this type of search requires you to identify terms that *may* have been used to describe the concept, which is no easy feat.\n\nWhat's more, this doesn't solve the problem of how to rank the list of resulting objects.\n\nWith the above search query, an entry merely containing a mention of a different European city (i.e. not very relevant) would be given equal weighting to an entry for Paris, or Rome, which would be highly relevant.\n\nA vector database makes this job simpler by enabling searches based on similarity.\n\n####  Examples of vector search\n\nInstead of searching for an exact match, you could perform a query to find objects that are \"nearest\" to \"Major European city\".\n\nWhat it would then return is a list of entries that are *ranked by their similarity* to the query.\n\nIn other words, the results would reflect their similarity to the idea, or meaning, of \"Major European city\".\n\nWhat's more, Weaviate \"indexes\" the data based on their similarity, making this type of data retrieval lightning-fast.\n\nWeaviate can help you to do all this, and actually a lot more. Another way to think about Weaviate is that it supercharges the way you use information.\n\nA vector search is also referred to as a \"semantic search\" because it returns results based on the similarity of meaning (therefore \"semantic\").\n\n###  Open-source\n\nWeaviate is open-source. In other words, its [codebase is available online](https://github.com/weaviate/weaviate) for anyone to see and use[(1)](#1).\n\nAnd that is *the* codebase, regardless of how you use it. So whether you run Weaviate on your own computer, on a cloud computing environment, or through our managed service [Weaviate Cloud (WCD)](https://console.weaviate.cloud/), you are using the exact same technology.\n\nSo, if you want, you can run Weaviate for free on your own device, or use our managed service for convenience. You can also take comfort in that you can see exactly what you are running, and be a part of the open-source community, as well as to shape its development.\n\nIt also means that your knowledge about Weaviate is fungible, between local, cloud, or managed instances of Weaviate. So anything you learn here about Weaviate using WCD will be equally applicable to running it locally, and vice versa. 😉\n\n###  Information, made dynamic\n\nWe are used to thinking of information as static, like a book. But with Weaviate and modern AI-driven language models, we can do much more than just retrieve static information but easily build on top of it. Take a look at these examples:\n\n####  Question answering\n\nGiven a list of Wikipedia entries, you could ask Weaviate:\n\nWhen was Lewis Hamilton born?\n\nAnd it would answer with:\n\nLewis Hamilton was born on January 7, 1985. ([check for yourself](https://en.wikipedia.org/wiki/Lewis_Hamilton))\n\n####  Generative search\n\nOr you can synthesize passages using retrieved information with Weaviate:\n\nHere is one, where we searched Weaviate for an entry on a \"racing driver\", and produce the result in the format of:\n\nWrite a fun tweet encouraging people to read about this: ## {title} by summarizing highlights from: ## {wiki_summary}\n\nWhich produces:\n\nCheck out the amazing story of Lewis Hamilton, the 7-time Formula One World Drivers' Championship winner! From his humble beginnings to becoming one of the world's most influential people, his journey is an inspiring one. #LewisHamilton #FormulaOne #Motorsport #Racing\n\nWe will cover these and many more capabilities, such as vectorization, summarization and classification, in our units.\n\nFor now, keep in mind that Weaviate is a vector database at its core which can also leverage AI tools to do more with the retrieved information.\n\n##  Review\n\nIn this section, you learned about what Weaviate is and how it works at a very high level. You have also been introduced to what vector search is at a high level, that it is a similarity-based search method.\n\n###  Review exercises\n\n\n\n\n\n\n\n###  Key takeaways\n\n- Weaviate is an open source vector database.\n- The core Weaviate library is the same whether you run it locally, on the cloud, or with WCD.\n- Vector searches are similarity-based searches.\n- Weaviate can also transform your data after retrieving it before returning it to you.\n\n##  Notes\n\n(1) Subject to terms of its license, of course.\n\n## Questions and feedback\n\n\n\nimport Quiz from '/src/components/Academy/quiz.js'\nconst weaviateOpenSource = [\n  {\n    questionText: 'What is the difference in the Weaviate codebase between local and cloud deployments?',\n    answerOptions: [\n      { answerText: 'Cloud deployments always include additional modules.', isCorrect: false, feedback: 'Cloud deployments of Weaviate do not include any special, or additional, modules.'},\n      { answerText: 'Local deployments are optimized for GPU use.', isCorrect: false, feedback: 'GPU usage can be enabled for inference whether locally or remotely deployed.'},\n      { answerText: 'Cloud deployments are optimized for scalability.', isCorrect: false, feedback: 'We agree that cloud deployments should be optimized for scalability. But the Weaviate codebase is built for scalability regardless of deployment location.'},\n      { answerText: 'None, they are the same.', isCorrect: true, feedback: 'They are the same, open-source codebase available on GitHub.'},\n    ],\n  },\n];\nconst vectorSearchDefinition = [\n  {\n    questionText: 'What is the best description of vector search?',\n    answerOptions: [\n      { answerText: 'Vector search is a directional search.', isCorrect: false, feedback: 'The definition of \"vector\" in this context is not direction-related.'},\n      { answerText: 'Vector search is a similarity-based search.', isCorrect: true, feedback: 'It searches a data collection or database for proximity in its representation of \"meaning\".'},\n      { answerText: 'Vector search is a number-based search.', isCorrect: false, feedback: 'This is partially true, but not the best answer. While there are numbers involved, that description does not quite capture the key concept of vector searches.'},\n    ],\n  },\n];\n",
        author: "",
        category: ["Documentation"],
        collection_name: "weaviate_documentation",
        chunk_spans: [
          {
            start: 2476,
            end: 3006,
          },
        ],
      },
    ],
    metadata: {
      collection_name: "weaviate_documentation",
      return_type: "document",
      output_type: "original",
      query_text: "What is Weaviate?",
      query_type: "semantic",
      code: {
        language: "python",
        title: "Query",
        text: 'collection.query.near_text(\n    query="What is Weaviate?",\n    limit=5\n)',
      },
      chunked: true,
    },
    code: {
      language: "python",
      title: "Query",
      text: 'collection.query.near_text(\n    query="What is Weaviate?",\n    limit=5\n)',
    },
  },
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export const example_product: any = {
  type: "result",
  conversation_id: "c3d78d4e-b06a-4abd-a116-91b4a3af2921",
  query_id: "17cf163e-4143-4210-a1a1-25ec5b5ee4e6",
  id: "res-d1f26250-686e-4771-a1c8-37951175c3b2",
  payload: {
    type: "product",
    objects: [
      {
        collection: "Fairycore",
        tags: ["most loved"],
        description:
          "Delve into a world of whimsy with this delicate blouse, featuring soft flutters of fabric and subtle hints of pastel blue and pink. Perfect for those who find magic in the details.",
        id: "1acbf0f0-20e0-4a45-ac0e-dcb3f55452b8",
        url: "",
        price: 58,
        rating: 4.5,
        brand: "Nova Nest",
        subcategory: "Blouses & Shirts",
        name: "Blue Breeze Blouse",
        reviews: [
          "Feels like a dream when worn. Soft and ethereal!",
          "Perfect for my garden tea party. Got so many compliments.",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/1acbf0f0-20e0-4a45-ac0e-dcb3f55452b8.png",
        category: "Tops",
        colors: ["blue", "pink"],
        sizes: "",
        uuid: "70add9bb062856f6957258a4a45110eb",
        summary: "",
      },
      {
        collection: "Y2K",
        tags: [],
        description:
          "A soft, stretchy cotton tee in pastel pink, adorned with a playful sprinkle of baby blue cloud graphics. Perfect for a casual, whimsical look.",
        id: "5286c4fa-e3a9-42ef-8e14-7d5e336b15af",
        url: "",
        price: 25.99,
        rating: 4.5,
        brand: "Vivid Verse",
        subcategory: "T-Shirts",
        name: "Candy Cloud Baby Tee",
        reviews: [
          "Absolutely adorable! Feels like a throwback to my favorite era.",
          "Soft fabric and the fit is just right. Love the pastel colors!",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/5286c4fa-e3a9-42ef-8e14-7d5e336b15af.png",
        category: "Tops",
        colors: ["pink", "blue"],
        sizes: "",
        uuid: "8a1f3dfb7ec65d248df0e532d9b28419",
        summary: "",
      },
      {
        collection: "Y2K",
        tags: [],
        description:
          "Embrace the dawn of pastel hues with these ultra-comfy low-rise jeans, featuring a soft pink wash that's sure to brighten up your day.",
        id: "44936295-1af5-4440-ae21-09b144b6b8bf",
        url: "",
        price: 58.99,
        rating: 4.5,
        brand: "Vivid Verse",
        subcategory: "Jeans",
        name: "Pastel Dawn Jeans",
        reviews: [
          "Super comfy and the color is just adorable!",
          "Love the fit, feels like a throwback to a sunnier time.",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/44936295-1af5-4440-ae21-09b144b6b8bf.png",
        category: "Bottoms",
        colors: ["pink"],
        sizes: "",
        uuid: "b48e55a7987b5b75af660c91a6760dde",
        summary: "",
      },
      {
        collection: "Y2K",
        tags: [],
        description:
          "Embrace the charm of early turn-of-the-century vibes with our soft cotton tee, featuring a vibrant pastel pink hue. Accentuated with a delicate baby blue trim, this tee is the epitome of throwback flair.",
        id: "dc3b967a-ef81-4f62-a3bc-67ecf2f07a0c",
        url: "",
        price: 29.99,
        rating: 4.8,
        brand: "Nova Nest",
        subcategory: "T-Shirts",
        name: "Pastel Prism Baby Tee",
        reviews: [
          "Absolutely adore the nostalgic feel!",
          "The colors are so vibrant. Love it!",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/dc3b967a-ef81-4f62-a3bc-67ecf2f07a0c.png",
        category: "Tops",
        colors: ["pink", "blue"],
        sizes: "",
        uuid: "ae6c39e837da5412b7f9ac3b0a43ebc8",
        summary: "",
      },
      {
        collection: "Cottagecore",
        tags: [],
        description:
          "Embrace the serenity of countryside elegance with this floor-length chiffon gown, detailed with a subtle v-neckline and soft, flowing sleeves. Perfect for twilight gatherings under the open sky, its lavender hue and delicate fabric embody the essence of pastoral serenity.",
        id: "e7690ae0-5a94-4ef5-b1d1-e95c0ad8607f",
        url: "",
        price: 189.99,
        rating: 4.8,
        brand: "Canvas & Co.",
        subcategory: "Formal Dresses",
        name: "Blossom Twilight Gown",
        reviews: [
          "Feels like a fairy tale wearing this dress!",
          "The lavender color is just perfect for a garden wedding.",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/e7690ae0-5a94-4ef5-b1d1-e95c0ad8607f.png",
        category: "Dresses & Jumpsuits",
        colors: ["purple"],
        sizes: "",
        uuid: "338b364b3efc5a59bac08a5668c3f187",
        summary: "",
      },
      {
        collection: "Y2K",
        tags: ["sale", "most loved"],
        description:
          "Channel the vibe of early millennial fashion with this glossy pastel pink tank. Perfect for expressing your vibrant, playful side while keeping it effortlessly chic.",
        id: "d99464b4-9bc9-4271-ae77-b502d1c696e6",
        url: "",
        price: 24.99,
        rating: 4.5,
        brand: "Vivid Verse",
        subcategory: "Tank Tops",
        name: "Bubblegum Bliss Tank",
        reviews: [
          "Absolutely LOVE! Takes me right back but still feels fresh.",
          "The color is perfect, just what I was looking for.",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/d99464b4-9bc9-4271-ae77-b502d1c696e6.png",
        category: "Tops",
        colors: ["pink"],
        sizes: "",
        uuid: "6c482ae93fec5050800b445930bf5a26",
        summary: "",
      },
      {
        collection: "Y2K",
        tags: [],
        description:
          "Embrace the playful essence of early aughts with our Pastel Dream Crop Jacket. Featuring a cropped silhouette, this piece is drenched in a soft baby blue hue, complemented by shimmering pink accents along the cuffs and hem. Designed for those who adore a flash from the past but demand the flair of today.",
        id: "a4c1a500-bfa0-4bcb-920e-8fc330235bb7",
        url: "",
        price: 59.99,
        rating: 4.5,
        brand: "Vivid Verse",
        subcategory: "Jackets",
        name: "Pastel Dream Crop Jacket",
        reviews: [
          "Absolutely love the fit and colors! It takes me right back.",
          "The pink shimmer is everything! So unique, yet totally wearable.",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/a4c1a500-bfa0-4bcb-920e-8fc330235bb7.png",
        category: "Outerwear",
        colors: ["blue", "pink"],
        sizes: "",
        uuid: "f00c1e42d1115dc6996f9f28b8cd3896",
        summary: "",
      },
      {
        collection: "Y2K",
        tags: ["most loved"],
        description:
          "Embrace early millennium vibes with this shiny pastel cardigan. Features a metallic sheen over baby blue and soft pink hues, perfect for adding a pop of color and nostalgia to any outfit.",
        id: "adde1e4f-69c4-4d52-87c2-860df3f9f99d",
        url: "",
        price: 48.99,
        rating: 4.5,
        brand: "Vivid Verse",
        subcategory: "Sweaters & Cardigans",
        name: "Metallic Pastel Dream Cardigan",
        reviews: [
          "Absolutely in love with the colors and fit!",
          "Brings back so many memories, plus it's super comfy.",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/adde1e4f-69c4-4d52-87c2-860df3f9f99d.png",
        category: "Outerwear",
        colors: ["blue", "pink"],
        sizes: "",
        uuid: "b025754d51d959948d48938420bfd2ae",
        summary: "",
      },
      {
        collection: "Cottagecore",
        tags: ["new in", "most loved"],
        description:
          "Embrace the tranquil essence of countryside mornings with this light, breezy dress. Perfect for a leisurely stroll through the garden or a relaxed afternoon on the porch, its soft pastel yellow and subtle green hues evoke a feeling of harmony with nature.",
        id: "13ff5949-e364-47c3-9043-e68729597ecf",
        url: "",
        price: 65,
        rating: 4.7,
        brand: "Canvas & Co.",
        subcategory: "Casual Dresses",
        name: "Sunrise Serenity Dress",
        reviews: [
          "Absolutely in love with the softness and simplicity of this dress!",
          "The perfect outfit for a sunny picnic. Light, comfortable, and fits wonderfully.",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/13ff5949-e364-47c3-9043-e68729597ecf.png",
        category: "Dresses & Jumpsuits",
        colors: ["yellow", "green"],
        sizes: "",
        uuid: "8794f86b250f5aa29ef20692b3ca5138",
        summary: "",
      },
      {
        collection: "Y2K",
        tags: [],
        description:
          "Embrace the dawn of the millennium in this baby blue mini dress, featuring a shimmering iridescent finish and a flirtatiously flared skirt. Perfect for turning heads at any daytime soiree or nighttime bash.",
        id: "864c977c-1217-4547-b6ba-3eaa1732b473",
        url: "",
        price: 58.99,
        rating: 4.6,
        brand: "Vivid Verse",
        subcategory: "Casual Dresses",
        name: "Twilight Spark Mini Dress",
        reviews: [
          "Absolutely in love with the retro vibe!",
          "The material catches the light beautifully. Got so many compliments.",
        ],
        image:
          "https://d3o574pyao1sq3.cloudfront.net/fashion/864c977c-1217-4547-b6ba-3eaa1732b473.png",
        category: "Dresses & Jumpsuits",
        colors: ["blue", "purple"],
        sizes: "",
        uuid: "eb6196441bae56fc9fd27d8957b363ca",
        summary: "",
      },
    ],
    metadata: {
      collection_name: "ecommerce",
      return_type: "product",
      output_type: "original",
      query_text: "pink clothes",
      query_type: "hybrid",
      code: {
        language: "python",
        title: "Query",
        text: 'collection.query.hybrid(\n    query="pink clothes",\n    limit=10\n)',
      },
    },
    code: {
      language: "python",
      title: "Query",
      text: 'collection.query.hybrid(\n    query="pink clothes",\n    limit=10\n)',
    },
  },
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export const example_weather: any = {
  type: "result",
  conversation_id: "c4f18512-052b-4786-b4c0-548ac3decace",
  query_id: "0f27ed16-f70d-4705-aa87-1da8fa59c5f1",
  id: "res-245357c2-cba6-4c02-a776-1cdff65a5ef9",
  payload: {
    type: "aggregation",
    objects: [
      {
        weather: {
          precip_Type: {
            type: "text",
            values: [
              {
                value: 17584,
                field: "rain",
                aggregation: "count",
              },
              {
                value: 1333,
                field: "snow",
                aggregation: "count",
              },
              {
                value: 374,
                field: "NaN",
                aggregation: "count",
              },
            ],
            groups: {
              rain: {
                humidity: {
                  type: "number",
                  values: [
                    {
                      value: 1,
                      field: null,
                      aggregation: "maximum",
                    },
                    {
                      value: 0.7429526842584123,
                      field: null,
                      aggregation: "mean",
                    },
                    {
                      value: 0.18,
                      field: null,
                      aggregation: "minimum",
                    },
                  ],
                },
              },
              snow: {
                humidity: {
                  type: "number",
                  values: [
                    {
                      value: 1,
                      field: null,
                      aggregation: "maximum",
                    },
                    {
                      value: 0.872258064516131,
                      field: null,
                      aggregation: "mean",
                    },
                    {
                      value: 0.5,
                      field: null,
                      aggregation: "minimum",
                    },
                  ],
                },
              },
              NaN: {
                humidity: {
                  type: "number",
                  values: [
                    {
                      value: 0.96,
                      field: null,
                      aggregation: "maximum",
                    },
                    {
                      value: 0.7733957219251337,
                      field: null,
                      aggregation: "mean",
                    },
                    {
                      value: 0.54,
                      field: null,
                      aggregation: "minimum",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ],
    metadata: {
      collection_name: "weather",
      description: [
        "Aggregating weather data by precipitation type and calculating the min, max, and mean of the humidity value.",
      ],
      code: {
        language: "python",
        title: "Aggregation",
        text: 'collection.aggregate.over_all(\n    group_by=GroupByAggregate(prop="precip_Type"),\n    return_metrics=Metrics("humidity").number(minimum=True, maximum=True, mean=True)\n)',
      },
    },
    code: {
      language: "python",
      title: "Aggregation",
      text: 'collection.aggregate.over_all(\n    group_by=GroupByAggregate(prop="precip_Type"),\n    return_metrics=Metrics("humidity").number(minimum=True, maximum=True, mean=True)\n)',
    },
  },
};
