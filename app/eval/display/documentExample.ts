/* eslint-disable @typescript-eslint/no-explicit-any */
export const documentResponse: any = {
  id: "12345",
  query: "What is hybrid search in Weaviate?",
  messages: [
    {
      type: "User",
      id: "949a2d5a-acec-4b38-8653-ecd510451a5d",
      query_id: "b4c8ce36-0989-436e-966e-962efe8dacd3",
      conversation_id: "9eecf0fb-b3e2-4272-b8d3-050e0f2e7d95",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["what is Weaviate?"],
      },
    },
    {
      type: "text",
      id: "tex-75a69e92-5524-402f-b4ce-9778597a98fa",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "9eecf0fb-b3e2-4272-b8d3-050e0f2e7d95",
      query_id: "b4c8ce36-0989-436e-966e-962efe8dacd3",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will now search the Weaviate documentation and blog collections to find information about Weaviate.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-5748fd32-de1c-487d-85d2-c8ab1a54c07f",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "9eecf0fb-b3e2-4272-b8d3-050e0f2e7d95",
      query_id: "b4c8ce36-0989-436e-966e-962efe8dacd3",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'm using a hybrid search on the content of both the documentation and blog collections to find the most relevant information about Weaviate.",
          },
        ],
      },
    },
    {
      type: "result",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "9eecf0fb-b3e2-4272-b8d3-050e0f2e7d95",
      query_id: "b4c8ce36-0989-436e-966e-962efe8dacd3",
      id: "res-790f97c5-b9f9-42d5-8b4f-c131dd84c911",
      payload: {
        type: "document",
        objects: [
          {
            content:
              "\n##  Unit overview\n\nimport ReactPlayer from 'react-player/lazy'\n\n\n\n\n\n\nWelcome!\n\nThis is the beginning of your journey through the world of vectors with Weaviate. This unit will provide you with an overview of the fundamentals of Weaviate.\n\nYou'll first gain an understanding of what Weaviate is, and what it can do. You will then learn about what vector database and vector search are before going on to run Weaviate and perform vector searches yourself.\n\nBy the end of this unit, you will have a strong foundation of knowledge that will help you to effectively navigate the rest of the course, and for using Weaviate in your own projects.\n\n###  Prerequisites\n\n- None\n\n##  Learning objectives\n\n\n\n\n\n## Questions and feedback\n\n\n",
            title: "Theory Hello_weaviate",
            category: ["Documentation"],
            uuid: "2288bc03-5bfe-4bce-83d4-076d05a58444",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_0",
          },
          {
            content:
              "\nData Platforms offer robust solutions for managing, processing, and analyzing large volumes of data. These platforms provide tools and services that facilitate seamless data ingestion directly into Weaviate. \n\nLearn about how Weaviate integrates with these solutions:\n* [Airbyte](/developers/integrations/data-platforms/airbyte/)\n* [Aryn](/developers/integrations/data-platforms/aryn/)\n* [Astronomer](/developers/integrations/data-platforms/astronomer/)\n* [Boomi](/developers/integrations/data-platforms/boomi/)\n* [Box](/developers/integrations/data-platforms/box/)\n* [Confluent](/developers/integrations/data-platforms/confluent)\n* [Context Data](/developers/integrations/data-platforms/context-data/)\n* [Databricks](/developers/integrations/data-platforms/databricks/)\n* [Firecrawl](/developers/integrations/data-platforms/firecrawl/)\n* [IBM](/developers/integrations/data-platforms/ibm/)\n* [Unstructured](/developers/integrations/data-platforms/unstructured)\n",
            title: "Integrations Data-platforms",
            category: ["Documentation"],
            uuid: "c2678033-ee07-426b-a783-e663e21275cc",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_1",
          },
          {
            content:
              "\n##  Unit review\n\nIn this unit, we aimed to provide you with an overview of Weaviate.\n\nWe did this by covering what Weaviate is, and what it can do, before discussing what vector database and vector search are before going on to run Weaviate and perform vector searches yourself.\n\nNow, you should have a foundation of knowledge from which we can begin to learn more about Weaviate, including more details on how to build a database and perform queries. Before long, you will be creating your own projects using Weaviate.\n\n###  Learning outcomes\n\nHaving finished this unit, you should be able to:\n- Broadly describe what Weaviate is.\n- Outline what vector search is.\n- Create a Weaviate instance on WCD.\n- Install your preferred Weaviate client (Python for Weaviate Academy).\n- Describe some of Weaviate's capabilities.\n\n## Questions and feedback\n\n",
            title: "Hello_weaviate Wrap_up",
            category: ["Documentation"],
            uuid: "1a4a1e96-bf85-4457-b5c5-306b3b5b5d24",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_2",
          },
          {
            content:
              "\nThis section shows you how to configure Weaviate.\n\n- Extend Weaviate's functionality by adding vectorizers and other [modules](./modules.md)\n- Configure how Weaviate stores and indexes data\n\n  - [schema](../manage-data/collections.mdx)\n  - [data types](../config-refs/datatypes.md)\n  - [distance metrics](../config-refs/distances.md)\n\n- Manage performance and cost with [vector index properties](/developers/weaviate/config-refs/schema/vector-index)\n- [Back up](./backups.md) your Weaviate instance\n- Control access\n  - [authentication](./authentication.md)\n  - [authorization](./authorization.md)\n- [Monitor](./monitoring.md) your Weaviate instance\n",
            title: "Weaviate Configuration",
            category: ["Documentation"],
            uuid: "caa363c5-73c9-43b2-a0a6-a38b6eaa9640",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_3",
          },
          {
            content:
              "\n\n\n##  Unit overview\n\nimport ReactPlayer from 'react-player/lazy'\n\n\n\n\n\n\nWelcome!\n\nThis is the beginning of your journey through the world of vectors with Weaviate. This unit will provide you with an overview of the fundamentals of Weaviate.\n\nYou'll first gain an understanding of what Weaviate is, and what it can do. You will then learn about what vector database and vector search are before going on to run Weaviate and perform vector searches yourself.\n\nBy the end of this unit, you will have a strong foundation of knowledge that will help you to effectively navigate the rest of the course, and for using Weaviate in your own projects.\n\n###  Prerequisites\n\n- None\n\n##  Learning objectives\n\n\n\n\n\n## Questions and feedback\n\n\n",
            title: "Zero_to_mvp Hello_weaviate",
            category: ["Documentation"],
            uuid: "cd056a88-8be5-4f08-9f5f-dddb1c50457e",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_4",
          },
          {
            content:
              "\n\n\n\nThese pages can help with common questions:\n\n- [FAQ](./faq.md)\n- [Glossary](./glossary.md)\n- [Example datasets](./example-datasets.md)\n- [Example use cases](./example-use-cases.md)\n- [Index types and performance](./performance.md)\n- [Migration Guide](./migration/index.md)\n\n## (Even) more resources\n\nFor additional information, try these sources.\n\n- [Weaviate Community Forum](https://forum.weaviate.io/)\n- [Knowledge base of old issues](https://github.com/weaviate/weaviate/issues?utf8=%E2%9C%93&q=label%3Abug)\n- [Weaviate slack channel](https://weaviate.io/slack)\n\n\n## Questions and feedback\n\n\n",
            title: "Weaviate More-resources",
            category: ["Documentation"],
            uuid: "8e057128-06f6-481b-b724-dda2c6048dac",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_5",
          },
          {
            content:
              "\n[Dynamiq](https://www.getdynamiq.ai/) is an operating platform for building agentic AI applications.\n \n\n## Dynamiq and Weaviate\nWeaviate is a [supported document retriever](https://docs.getdynamiq.ai/low-code-builder/rag-nodes/inference-rag-workflow/document-retrievers#weaviate-retriever) in Dynamiq. The integration allows you to `read` and `write` to your Weaviate cluster to build robust RAG applications.\n\n## Our Resources \n[**Hands on Learning**](#hands-on-learning): Build your technical understanding with end-to-end tutorials.\n\n### Hands on Learning\n\n| Topic | Description | Resource | \n| --- | --- | --- |\n| Dynamiq Getting Started | A guide to integrating the Weaviate vector database with Dynamiq. | [Notebook](https://github.com/weaviate/recipes/blob/main/integrations/llm-agent-frameworks/dynamiq/dynamiq-getting-started.ipynb) | \n| Dynamiq Research Flow | Combine Dynamiq and Weaviate to streamline the research process, automate data storage, and generate research reports. | [Notebook](https://github.com/weaviate/recipes/blob/main/integrations/llm-agent-frameworks/dynamiq/dynamiq-research-workflow.ipynb) |",
            title: "Llm-agent-frameworks Dynamiq",
            category: ["Documentation"],
            uuid: "c717b8d7-dfe0-40f8-9544-0032df15764f",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_6",
          },
          {
            content:
              "\nThis section helps you to get started with Weaviate.\n\n## Guides\n\n- [Which Weaviate setup to use?](./which-weaviate.md): Find the right Weaviate setup for your needs.\n- [Collection definitions and schema](/developers/weaviate/starter-guides/managing-collections): How to define your collection settings and schema.\n  - [Collection scaling limits](/developers/weaviate/starter-guides/managing-collections/collections-scaling-limits): A guide on the benefits of using multi-tenancy when you have too many collections. \n- [Bring your own vectors](./custom-vectors.mdx): How to use your own vectors with Weaviate.\n- [Retrieval augmented generation (RAG)](./generative.md): Guide to performing retrieval augmented generation (RAG), or generative search.\n- [Indexing](./managing-resources/indexing.mdx): How does Weaviate index data for fast search and filtering? What index types and settings are right for me?\n- [Managing resources](./managing-resources/index.md): How to balance search speeds, accuracy/recall, and costs with Weaviate's flexible resource management features.\n",
            title: "Weaviate Starter-guides",
            category: ["Documentation"],
            uuid: "f6a2c923-a4a8-46ee-a28e-bffa04143c4b",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_7",
          },
          {
            content:
              "\nVectorETL by [Context Data](https://contextdata.ai/) is a modular no-code Python framework that is designed to help AI and Data Engineers work with data:\n\n* Quickly extract data from multiple data sources (databases, cloud storage, and local files)\n* Embed using major models (including OpenAI, Cohere, and Google Gemini)\n* Write to vector databases \n\n## Context Data and Weaviate\nWeaviate is a [target connection](https://context-data.gitbook.io/context-data-1/adding-target-connections#add-a-weaviate-target-connection) in Context Data. \n\nTo connect to Context Data, open the console and input your Weaviate instance's URL and authentication credentials when prompted.\n\n## Our Resources \n[**Hands on Learning**](#hands-on-learning): Build your technical understanding with end-to-end tutorials.\n\n### Hands on Learning\n\n| Topic | Description | Resource | \n| --- | --- | --- |\n| VectorETL into Weaviate | Three examples showing you how to ingest data from Google Cloud Storage, Postgres, and S3 into Weaviate. | [Notebook](https://github.com/weaviate/recipes/tree/main/integrations/data-platforms/context-data) |",
            title: "Data-platforms Context-data",
            category: ["Documentation"],
            uuid: "7ac5bbbd-7b7f-455e-8978-cfb9a4237b52",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_8",
          },
          {
            content:
              "\n[Boomi](https://boomi.com/) is an integration platform as a service, API management, master data management and data preparation solution.\n\n## Boomi and Weaviate\nWeaviate is integrated into Boomi's platform through Boomi's REST Client Connector. This integration allows users to perform operations such as data ingestion and retrieval within Weaviate directly from Boomi's low-code environment.\n\n\n## Our Resources \n[**Hands on Learning**](#hands-on-learning): Build your technical understanding with end-to-end tutorials.\n\n### Hands on Learning\n\n| Topic | Description | Resource |\n| --- | --- | --- |\n| Start Connecting with Weaviate | A replication of Weaviate's Quickstart tutorial on the Boomi platform using the REST Client connector. | [Article](https://community.boomi.com/s/article/Start-Connecting-with-Weaviate) [Tutorial](https://discover.boomi.com/solutions/start-connecting-with-weaviate) | \n\n\n",
            title: "Data-platforms Boomi",
            category: ["Documentation"],
            uuid: "3109b2d5-73d1-4e85-a4eb-e1c023a90253",
            collection_name: "Weaviate_documentation",
            chunk_spans: [],
            _REF_ID: "query_Weaviate_documentation_0_9",
          },
        ],
        metadata: {
          collection_name: "Weaviate_documentation",
          display_type: "document",
          needs_summarising: false,
          query_text: "what is Weaviate?",
          query_type: "hybrid",
          chunked: false,
          query_output: {
            target_collections: [
              "Weaviate_documentation",
              "ELYSIA_CHUNKED_weaviate_blogs__",
            ],
            search_type: "hybrid",
            search_query: "what is Weaviate?",
            sort_by: null,
            filter_buckets: null,
            limit: 10,
          },
          code: {
            language: "python",
            title: "Query",
            text: "collection.query.hybrid(\n    query='what is Weaviate?',\n    limit=10\n)",
          },
        },
        code: {
          language: "python",
          title: "Query",
          text: "collection.query.hybrid(\n    query='what is Weaviate?',\n    limit=10\n)",
        },
      },
    },
    {
      type: "result",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "9eecf0fb-b3e2-4272-b8d3-050e0f2e7d95",
      query_id: "b4c8ce36-0989-436e-966e-962efe8dacd3",
      id: "res-8c9c1f8d-0cf5-44d4-bf61-814bddb1999d",
      payload: {
        type: "document",
        objects: [
          {
            title: "Blog Crud-support-in-weaviate",
            content:
              "\nWith the rising popularity of machine learning models, the demand for vector similarity search solutions has also increased dramatically. Machine learning models typically output vectors and common search queries involve finding the closest set of related vectors. For example, for a text-based vector search the search query \"landmarks in Paris\" would be encoded to a vector, it is then the job of the vector database to find the documents with the vector closest to this query. This might be a document with the title \"Eiffel Tower\" whose vector matched the search vector most closely.\n\nSuch a vector similarity comparison is computationally trivial if there are very few, say less than 10,000 objects to be searched through. That is not a very realistic situation, however. The amount of unstructured data that companies and users need to search through is massive. The number of objects is often in the high millions or even billions of data points. A primitive brute-force comparison can no longer return results in an acceptable time frame.\n\nThis led to the rise of Approximate Nearest Neighbor (ANN) models. You might have heard of Spotify's Annoy, Facebook's faiss, or Google's ScaNN. What they all have in common is that they make a conscious trade-off between accuracy (precision, recall) and retrieval speed. This has enabled users to retrieve the 5, 10, or 100 closest vectors within a few milliseconds — even out of a billion objects.\n\nHowever, there is yet another trade-off engineers have to make when using ANN models. Many of the common ANN libraries fall short of some of the features we are used to when working with traditional databases and search engines. Imagine you were using a MySQL database, but after you imported your data it would be read-only for the rest of time. That's not how it works, right? So why should it work like this for vector searching? In this article, I'm going to introduce you to Weaviate, a vector database that removes many of the limitations imposed by ANN libraries.\n\n## Overview\nIn this article we will cover:\n\n* how ANN models enable fast & large-scale vector searches\n* where popular ANN libraries fall short\n* what Weaviate is and how it can bring your vector search needs to production\n* a glimpse of how Weaviate works under the hood\n\n## What is Weaviate?\nBefore we dive deeper into how Weaviate removes the limitations you might expect from existing ANN solutions, let's quickly take a look at what Weaviate is. Weaviate is a cloud-native, modular, real-time vector database built to scale your machine learning models. Oh, it's also open-source, by the way. Because of its modularity, Weaviate can cover a wide variety of bases. By default, Weaviate is agnostic of how you came up with your vectors. This means teams with experience in data science and machine learning can simply keep using their finely-tuned ML models and import their data objects alongside their existing vector positions. At the same time, Weaviate comes with optional modules for text, images, and other media types. Those modules can do the vectorization for you. Thus, if you are new to the world of machine learning you can import your objects just as you would with a traditional database and let Weaviate handle the vectorization. This brings the benefits of vector searching to the masses — even without an ML background. The ability to combine modules also allows for relations between e.g. a text object and a corresponding image object. As this article will show, Weaviate is also not restricted by some of the limitations of popular ANN libraries.\n\n## When do you call a database a database?\nIf you were to ask one hundred engineers what defines a database you will most likely get as many different answers. We might take the following points for granted in the world of SQL and NoSQL databases, yet they are anything but ubiquitous in the context of vector searches.\n\n* **CRUD**\n    We are used to databases allowing us to create, read, update and delete objects.\n* **Real-time (or near real-time)**\n    Objects imported into a database are typically queryable within a very short period. Some databases have refresh intervals and some databases make use of eventual consistency. Both can lead to a slight delay, but in general, objects are present within seconds as opposed to minutes or hours.\n* **Mutability**\n    Databases are generally mutable. This does not only refer to individual objects (as is already covered with CRUD abilities), but also to the entire database or a collection therein, such as a table in a SQL database. We are used to adding another row as we please.\n* **Persistence**\n    We generally expect database writes to be persistent. This does not mean that an in-memory database is not a database. But it does mean that when a database uses a disk, we do not expect writes to get lost — for example, on an unexpected restart.\n* **Consistency. Resiliency and Scaling**\n    Some databases have atomic transactions, others don't support consistency at all. Some databases scale really well in the cloud, others work best as big, single machines. The exact characteristics do not make a database a database. But the fact that the engineers who built it have decided on a specific strategy is a key trait of a database.\n\n## Popular ANN libraries fall short of many of the above principles\nThe biggest downside of ANN libraries is with regards to their real-time capabilities and mutability. Libraries, such as Annoy or ScaNN require you to import all of your data objects upfront. This is then followed by a build period to build up the index. After that's done, it's a read-only model. This brings two major disadvantages with regards to the points we outlined before: First up, if you import your first object it is not yet queryable until all objects are imported. If you import a billion objects this can be a very considerable time. They are therefore not real-time. Furthermore, once you have built your index, you cannot alter the index anymore without rebuilding it from scratch. Thus, operations, such as updating or deleting are impossible and the search model cannot be considered mutable — not even for further inserts.\n\nThe persistence strategy of the above models is typically snapshotting. So while you can save the index to disk and also reload it from disk, an individual write is typically not persisted. As Annoy, ScaNN and the like are not applications, but libraries, this also means that coming up with resiliency and scaling strategy is left to the developer. It is certainly not difficult to scale a read-only model. However, the feature set of simply duplicating your model does not compare to scaling popular distributed databases, such as [Cassandra](https://db-engines.com/en/system/Cassandra).\n\n## Weaviate overcomes the limitations of ANN libraries\n\nOne of the goals in designing Weaviate was to combine the speed and large-scale capabilities of ANN models with all the functionality we enjoy about databases. Thus, any object imported into Weaviate can immediately be queried — whether through a lookup by its id, a keyword search using the inverted index, or a vector search. This makes Weaviate a real-time vector database. And because Weaviate also uses an ANN model under the hood, the vector search will be as fast as with a vector library.\n\nAdditionally, objects can be updated or deleted at will and new objects can be added at any time — even while querying. This means Weaviate supports both full CRUD capabilities, as well as mutability of its indexes. Last but not least, every single write is persisted, if your machine crashes or Weaviate is otherwise forced to interrupt its operations, it will simply continue where you left off after restarting. There is no scenario where you import for hours on end only to lose all progress due to a crash at the last minute.\n\n## How can Weaviate achieve all of this?\nWeaviate is built around the idea of modularity. This also boils down to the ANN vector index models that Weaviate supports. At the time of writing this article in early 2021, the first vector index type that's supported is HNSW. By choosing this particular type, one of the limitations is already overcome: HNSW supports querying while inserting. This is a good basis for mutability, but it's not all.\n\nExisting HNSW libraries fall short of full CRUD-support. Updating is not possible at all and deleting is only mimicked by marking an object as deleted without cleaning it up. Furthermore, the most popular library hnswlib only supports snapshotting, but not individual writes to disk.\n\nTo get to where Weaviate is today, a custom HNSW implementation was needed. It follows the same principles [as outlined in this paper](https://arxiv.org/abs/1603.09320) but extends it with more features. Each write is added to a [write-ahead log](https://martinfowler.com/articles/patterns-of-distributed-systems/wal.html). Additionally, since inserts into HNSW are not mutable by default, Weaviate internally assigns an immutable document ID that allows for updates. If an object is altered, Weaviate deletes the old doc id under the hood, assigns a new one, and reimports the object into the vector index. Last, but not least, a tombstoning approach — inspired by Cassandra — is used to handle deletes. Any incoming delete — whether an explicit delete or an implicit delete through an update — leads to [marking a document ID as deleted](https://github.com/weaviate/weaviate/blob/b59527994a85d35664bec7eb5acc8fa628318a86/adapters/repos/db/vector/hnsw/delete.go#L23-L64) (\"attaching a tombstone\"). It is therefore immediately hidden on future query results. Then — and this is where Weaviate's custom HNSW implementation differs from hnswlib — an asynchronous [cleanup process rebuilds the affected parts of the index](https://github.com/weaviate/weaviate/blob/b59527994a85d35664bec7eb5acc8fa628318a86/adapters/repos/db/vector/hnsw/delete.go#L116-L167) and removes the tombstoned elements for good. This keeps the index fresh at all times while saving a lot of computing resources due to a well-tuned bulk cleanup process that is considerably faster than individual cleanups would be.\n\nIt is the combination of the above that makes Weaviate the perfect solution for handling your vector search needs in production.\n\n## Choose what's right for your use case — and try it out yourself!\nNow that you've learned about some of the limitations imposed by popular ANN libraries and how Weaviate helps you overcome them, there is just one question left to answer: When should you choose which? If you know for certain that you will never need to update your data, will never add a new data point, and don't need real-time abilities, a library like the ones mentioned above will be a good solution. But if you want to update your data, import additional objects even while queries are occurring, and not sacrifice real-time or persistence, then you should take a look at Weaviate.\n\nCheck out the [quickstart guide](/developers/weaviate/quickstart) in the documentation or [learn more about Weaviate here](/developers/weaviate). If you like what you've read and would consider using Weaviate in the future, feel free to leave a star on [GitHub](https://github.com/weaviate/weaviate).\n\n\nimport WhatNext from '/_includes/what-next.mdx'\n\n\n",
            category: ["Blog"],
            uuid: "198640fa-543d-4c5f-87e3-da9780e84970",
            collection_name: "Weaviate_blogs",
            chunk_spans: [
              {
                start: 2581,
                end: 3051,
                uuid: "36646a4a-21ee-5514-8cea-cbb14dbb6678",
              },
              {
                start: 2034,
                end: 2619,
                uuid: "1349145a-70c0-5b1e-b834-b4a259425a53",
              },
            ],
          },
          {
            title: "Blog Private-llm",
            content:
              "\nLarge Language Models (LLM’s) have revolutionized how we access and consume information, shifting the pendulum from a search engine market that was predominantly retrieval-based (where we asked for source documents containing concepts relevant to our search query), to one now that is growingly memory-based and performs generative search (where we ask LLMs to generate answers to questions based on their knowledge of and training on massive datasets). More importantly, what’s different this time is that with the advent of widely accessible products like ChatGPT that have exposed the underlying technology of these models to the wider consumer market, we’re seeing these models revolutionize how we work, learn and interact on a scale never seen before.\n\nThis wide-scale adoption of LLMs makes the concerns and challenges around privacy and data security paramount, and ones that each organization needs to address. In this blog post we will explore some of the different potential approaches organizations can take to ensure robust data privacy while harnessing the power of these LLMs.\n\n## Understanding the Privacy Challenge\n\nLLMs are typically trained on vast amounts of data to develop a statistical understanding of human language patterns. If you’d like to get an introductory explanation of how these models work, please read our previous blogpost: [How LLMs Work](/blog/what-are-llms). The extensive datasets used in training can often contain sensitive information, leading to privacy concerns. Additionally, the traditional approach of relying on cloud-based services to deploy and conduct inference with these models requires organizations to transfer their data to third-party centralized model providers which can lead to data exposure, data breaches, and unauthorized access. This is the very reason large corporations such as Samsung, Apple, Verizon, JPMorgan and many more have [limited their employees from using these services](https://www.hr-brew.com/stories/2023/05/11/these-companies-have-banned-chatgpt-in-the-office).\n\nTo leverage the advantages of generative AI while simultaneously addressing these privacy concerns, the field of privacy-preserving machine learning has emerged, offering techniques and tools that allow for the secure execution of large language models while protecting the confidentiality of sensitive data both during model fine-tuning as well as when providing responses grounded in proprietary data.\n\n## Potential Solutions to the Privacy Challenge\n\n### Federated Learning\n\n![Federated](./img/federated.png)\n\nFederated Learning enables model training without directly accessing or transferring user data. Instead, individual edge devices or servers collaboratively train the model while keeping the data local. This approach ensures that sensitive data remains private, reducing the risk of data breaches during model fine-tuning on custom data.\n\nMore specifically, federated learning is a distributed approach to model training that allows multiple parties to collaborate without the need for centralized data sharing. In traditional machine learning, data is typically collected, centralized, and used for training a model. However, in scenarios where data privacy is a concern, federated learning offers a privacy-preserving alternative.\n\nThe core idea behind federated learning is to bring the model training process to the data instead of moving the data to a central location where model training occurs. This decentralized approach ensures that sensitive data remains local and does not need to be exposed or transferred. Instead, individual devices or servers participate in the training process by sending model updates to a central server, which aggregates and incorporates these updates to improve the global model.\n\nThe main challenge here is that training LLMs in central locations with access to large amounts of optimized computing is hard enough, and doing this in a distributed manner significantly complicates matters. You now have to worry about the heterogeneity of the data available on different edge devices that the model is training on, how to securely aggregate the learned weights from all the different edge devices, how to prevent adversaries from inferring private data from the individual model updates, as well as model compression and efficiency since now these edge devices like mobile phones have to upload model updates to be aggregated globally.\n\n### Homomorphic Encryption\n\n![Encryption](./img/encryption.png)\n\nHomomorphic encryption (HE) allows computations to be performed on encrypted data without decrypting it. It is a powerful tool for preserving privacy in scenarios where sensitive data needs to be processed or analyzed while maintaining confidentiality. This technique can be applied to LLMs, enabling private inference while preserving the confidentiality of user inputs. However, it's worth noting that homomorphic encryption can introduce computational overhead, impacting the model's performance.\n\nIn traditional encryption, encrypted data can only be operated on in its decrypted form. HE, on the other hand, enables computations to be carried out directly on encrypted data, producing encrypted results that can be decrypted to obtain the same outcome as if the computations were performed on the original, unencrypted data.\n\nHE enables the secure outsourcing of data processing tasks to third-party service providers or cloud platforms. Data owners can delegate computations without revealing the underlying data, ensuring confidentiality while benefiting from the superior computational resources available to large cloud providers. Allowing computations on encrypted data enables training and inference on sensitive datasets without revealing their contents. HE seems to be a very promising way of achieving privacy-preserving LLM usage simply by encrypting the prompt token and decrypting the generated response.\n\nOn a practical level however HE does have some disadvantages: it is much harder to implement LLM training and inference with HE data than on unencrypted data, and more compute is required to process encrypted data, which increases processing times and further increases compute requirements which are already very high. You also lose out on model quality and accuracy when training/inferencing on encrypted data (this is because the encryption process adds noise to the data) and thus you have to balance privacy vs. model performance/utility.\n\n### Locally Deployed LLMs\n\nAnother option is to run open-source LLMs locally vs running models that can only be accessed by general-purpose black-box APIs. Out of all of the privacy-preserving machine learning techniques presented thus far, this is perhaps the most production-ready and practical solution organizations can implement today. There are already some preliminary solutions that are publicly available that allow you to deploy LLMs locally, including [privateGPT](https://github.com/imartinez/privateGPT) and [h2oGPT](https://github.com/h2oai/h2ogpt). These solutions, which are currently proof of concepts, are taking advantage of the growing zoo of open-source LLMs, including the famous [LLaMA](https://arxiv.org/abs/2302.13971) model from Meta, which is proven to perform quite well with some limited fine-tuning, as presented in this [recent paper](https://arxiv.org/abs/2305.11206).\n\nLet’s dig deeper into locally deployed LLMs, and see how companies can more securely leverage the power of open source software (OSS) LLMs on their own proprietary documents, all in the privacy of their on-prem or hybrid servers.\n\n## Locally Running LLMs With Custom Data\n\nPrior to discussing how you can run OSS LLMs locally, let's discuss how you can get any LLM, local or remote, to answer prompts grounded in your custom data. The key ingredient here is to store the documents that you want to use to provide the LLM custom context, in a [vector database](/blog/what-is-a-vector-database) so that when needed the LLM can look up and retrieve the relevant documents and consume them to learn more context prior to generating a prompt. This not only provides the LLM custom data and context where it previously had none, but it also prevents hallucinations, since you help provide the LLM with relevant information, greatly reducing the chances it will make something up to fulfill the prompt. This process is known as [retrieval augmented generation (RAG)](https://arxiv.org/pdf/2005.11401.pdf) since you are augmenting the generation process of the LLM with retrieved documents from your vector database.\n\nCurrently, RAG is a 4-step process illustrated in the figure below:\n\n\n\n![fig1](./img/fig1.png)\n Figure 1. Step 1&2: Query your remotely deployed vector database that stores your proprietary data to retrieve the documents relevant to your current prompt. Step3&4: Stuff the returned documents along with the prompt into the context tokens provided to the remote LLM; which it will then use to generate a custom response. \n\n\nAs shown in the above image, this process requires you to remotely store your documents in a cloud-hosted vector database and also call an API which allows you to prompt a remotely deployed LLM. This exact workflow can be replicated using [Weaviate Cloud](https://console.weaviate.cloud/) and any one of the generative modules ([OpenAI](/developers/weaviate/model-providers/openai/generative), [Cohere](/developers/weaviate/model-providers/cohere/generative), [PaLM](/developers/weaviate/model-providers/google/generative)).\n\nNow let's discuss how you can modify this setup to achieve a completely local vector database and LLM setup. The first step to a fully local setup is to bring our proprietary data into our local environment. For some organizations, this means running the vector database on premises within their walls. For others this can mean running the vector database on their own self-managed virtual private cloud (VPC). Either of these workflows can be set up with a vector database like Weaviate, enabling a secure and private solution where data included in Step 1&2 doesn’t leave your organization. The generative modules mentioned above can also be used in this setup seamlessly but note that in this setup, retrieved documents included with the prompt will need to be shared with the LLM that is remotely hosted. This is what our modified workflow now looks like:\n\n\n\n![fig2](./img/fig2.png)\n Figure 2. Step 1&2: Query your locally deployed vector database that stores your proprietary data to retrieve the documents relevant to your current prompt. Step3&4: Stuff the returned documents along with the prompt into the context tokens provided to the remote LLM; which it will then use to generate a custom response. \n\n\nIn order to bring the LLMs into your local environment you need to have access to their weights so that you can perform inference with them locally on demand. As a result, you can only use open-source models along with vector databases that can be deployed on-prem or within your VPC for this next setup displayed in Figure 3 below.\n\n\n\n![fig3](./img/fig3.png)\n Figure 3. Step 1&2: Query your locally deployed vector database that stores your proprietary data to retrieve the documents relevant to your current prompt. Step3&4: Stuff the returned documents along with the prompt into the context tokens provided to the locally running OSS LLM; which it will then use to generate a custom response. \n\n\nWith this above setup, now we can conduct RAG completely locally and privately. In order for you to play around with this setup, we have developed a Weaviate integration for privateGPT that implements that above setup [here](https://github.com/hsm207/privateGPT). This integration allows you to vectorize, ingest and query your own custom documents with open source models, as well as having Weaviate act as a vector store, completely locally. You can run this demo offline if you wanted once you have all the required dependencies. If you implement the above demo, one of the limitations you’ll find is the remarkably slow inference times when running the LLM on your own machine. Let's discuss some of the advantages and disadvantages of the above fully local private setup that can be used to perform RAG on your proprietary data.\n\n## Advantages and Disadvantages of a Local/Private Setup\n\nThe advantages of locally deploying your vector database and LLM models first and foremost is the data privacy guarantee: user and proprietary data now remain within the local infrastructure, reducing chances of exposure to external entities and mitigating third-party risk. If you keep your VectorDB+LLM local, another advantage is the reduction of the attack surface and potential vulnerabilities associated with network communications and unauthorized data access. These privacy guarantees can facilitate compliance with data protection and privacy regulations which are pivotal for regulated businesses that operate in healthcare, finance, etc.\n\nOn the other hand, a RAG stack running locally or on your VPC is constrained by the compute and resources that you can make available to it. This is the main reason the above privateGPT demo with Weaviate might run quite slowly on your own machines. Organizations need to invest in high-performance hardware, such as powerful servers or specialized hardware accelerators, to handle the computational demands. This can result in high upfront costs, ongoing maintenance expenses as well as difficulty scaling quickly if needed. Another disadvantage of bringing the tech stack local is the responsibility of infrastructure maintenance, system administration, security updates as well as machine learning-specific model updates which require extensive technical expertise. For this reason, this solution is great for larger companies like Samsung, Apple, and JPMorgan that have the budget to afford the required compute and expertise, and less so for resource-constrained smaller-scale companies.\n\n## Conclusion\n\nThe advent of large language models and consumer-wide adoption has brought tremendous progress, but a by-product of this large-scale adoption is that privacy concerns have also become more pronounced. However, advances in privacy-preserving techniques have made it possible to harness the power of large language models while upholding the highest standards of data privacy and security.\n\nIn this blog post, we discussed some cutting-edge approaches to privacy-preserving ML, such as federated learning and homomorphic encryption (which are currently being developed and have great potential in the future), as well as a more practical approach that can take advantage of OSS LLMs and vector databases to power generative search and custom chatbots locally and privately.\n\nAs we move forward, it is crucial for the AI community to continue prioritizing privacy and security, ensuring that LLMs can be deployed in a manner that respects individual privacy rights.\n\nimport WhatNext from '/_includes/what-next.mdx'\n\n\n",
            category: ["Blog"],
            uuid: "2e092919-3292-4292-babd-6edae5994849",
            collection_name: "Weaviate_blogs",
            chunk_spans: [
              {
                start: 9833,
                end: 10427,
                uuid: "3b153767-fb79-54e8-a6ed-8434038770c3",
              },
            ],
          },
          {
            title: "Blog Ref2vec-centroid",
            content:
              '\nWeaviate 1.16 introduced the [Ref2Vec](/developers/weaviate/modules/ref2vec-centroid) module. In this article, we give you an overview of what Ref2Vec is and some examples in which it can add value such as recommendations or representing long objects.\n\n## What is Ref2Vec?\nThe name Ref2Vec is short for reference-to-vector, and it offers the ability to vectorize a data object with its cross-references to other objects. The Ref2Vec module currently holds the name ref2vec-**centroid** because it uses the average, or centroid vector, of the cross-referenced vectors to represent the **referencing** object. The benefit of this approach is that the referencing object can be characterized from its actions and relationships as well as refined over time.\n\nIn one example, we could use Ref2Vec in a Weaviate database containing **User** and **Product** classes of objects to produce recommendations. Here, the Product class may include various types of vectorized items, such as shoes, or clothing, and a User could be vectorized by its relationships to Product instances. So a User who has liked 3 shoe Product instances will be represented as the average vector of the 3 shoe Product vectors, whereas another User might be represented by an average vector of whatever Product instances that they liked. This can be used for recommendation, for instance, by treating the averaged vector of the User as a search query in Product objects.\n\nThe following image depicts how Ref2Vec aggregates the representations of 3 Product items to represent a User who has purchased a pair of boots, shorts, and Weaviate t-shirt!\n\n![Ref2Vec Image](./img/ref2vec.png)\n\nSuch a representation of the User, by an aggregation of their cross-references, allows Weaviate to conveniently and immediately learn from each User\'s preferences and actions to provide improved and up-to-date characterizations. Ref2Vec can in other words capture each User\'s interests and tendencies across multiple axes, such as product categories or even fashion styles! And by doing so, the resulting recommendations can more closely match the User\'s product and style preferences.\n\nWe envision Ref2Vec to have great potential in multiple application areas. Let\'s take a look at a few of them in more detail, starting with recommendation systems.\n\n## Recommendation in Weaviate\nMany of you might primarily know Weaviate as a vector database and search engine, but Weaviate can also power high-quality, lightning-fast recommendations. This is because Recommendation is a very similar task to Search from the perspective of a vector database. Both tasks leverage the ANN index of vector representations to search for a suitable object. The key difference is that in Search, relevance is typically contained entirely within the query. In Recommendation, relevance is additionally dependent on the user, making the query a subjective, user-dependent task rather than an objective task. So if a User searches for "adidas  shoes for the summer", not only does Weaviate need to find these particular kinds of shoes, but it also needs to rank them based on relevance to the particular user\'s interests!\n\nWith Ref2Vec, this task is made easier by representing a user\'s interests by drawing a graph of cross-references from the user to objects the user has engaged with. This gives Weaviate unique points of reference for each user that can be used to rank the search results.\n\nIn Weaviate, Classes represent data objects such as Users, Products, or Brands. The vector for an instance of a Class, such as a Product, is obtained from a Machine Learning model\'s inference of (typically) an image or text description of the Product. Additionally, Weaviate\'s cross-references enable relations between Classes, such as Users that "liked" a Product. For example, User, Product, and Brand objects may each have a vector representation, symbolic properties like name or price, and relations as shown below.\n\n![Cross-reference](./img/Weaviate-Ref2Vec_1.png)\n\nRef2Vec gives Weaviate another way to vectorize a class, such as the User class, based on their relationships to other classes. This allows Weaviate to quickly create up-to-date representations of users based on their relationships such as recent interactions. If a user clicks on 3 shoe images on an e-commerce store, it is a safe bet that they want to see more shoes. Ref2Vec captures this intuition by calculating vectors that aggregate each User\'s interaction with another class.\n\nThe below animation visualizes a real example of this in e-Commerce images. The demo is organized such that user interactions are outlined with a green box and moved to the top-left of the grid. The nearest neighbors to the ref2vec-centroid are then arranged from left-to-right top-down.\n\n\n  \nYour browser does not support the video tag.\n\n\nThis animation shows how selecting multiple backpacks (such as two school-style book bags) can help personalize the user\'s recommendations (so showing more backpacks in a similar style rather than the duffle bags). We also see here how selecting multiple digital LED screen watches moves results away from analog watches. In other words, the User vector is being updated in real-time here to take into account their preferences and actions, which helps to produce more relevant results at speed. Another benefit of Ref2Vec is that this calculation is not compute-heavy, leading to low overhead.\n\nWith Ref2Vec, you can use Weaviate to provide Recommendation with "user-as-query". This is a very common and powerful way to build Home Feed style features in apps. This can be done by sending queries like this to Weaviate:\n\n```graphql\n{\n  Get {\n    Product (\n      nearObject: {\n        id: "8abc5-4d5..." # id for the User object with vector defined by ref2vec-centroid\n      }\n    ) {\n      product_name\n      price\n    }\n  }\n}\n```\n\nThis short query encapsulates the power of Ref2Vec. Although all the query does is provide the ID of the User object, Ref2Vec has done the hard work by inferring a centroid vector from the User\'s references to other vectors. And as the set of references continues to evolve, the Ref2Vec vectors will continue to evolve also, ensuring that the User vector remains up-to-date with their latest interests.\n\nWhether your goal is to construct a Home Feed interface for users or to pair with search queries, Ref2Vec provides a strong foundation to enable Recommendation with fairly low overhead. For example, it can achieve personalized re-ranking, also known as a session-based recommendation, without persisting user data over a long sequence of interactions. A new user could have personalization available after a few interactions on the app which will help them quickly settle in and feel at home, helping to overcome what is known as the cold-start problem.\n\n\n## Representing long objects\n\nOne of the most outstanding problems in Search technology is finding suitable representations for long objects. In this sense, "long" is used to describe text documents that significantly exceed the 512 token input limit on Deep Transformer Neural Networks. This problem is a large part of what motivates our interest in Hybrid Search techniques that combine the flexibility of Vector Search with the sparse BM25 word counting algorithm well suited for >512 token text sequences. We think Ref2Vec can also help address this challenge.\n\nTo be clear, Weaviate already offers a solution to represent long documents with Cross-References! As an example, [the Wikipedia Demo](https://github.com/weaviate/semantic-search-through-wikipedia-with-weaviate) breaks the long Wikipedia articles into a (Paragraph, inArticle, Article) data schema in which each Paragraph contains less than 512 tokens of text. This allows us to combine the title of the Article with the vector search in the Paragraph vectors in Weaviate with the following query:\n\n```graphql\n{\n  Get {\n    Paragraph(\n      nearText: {\n        concepts: ["What was Obama\'s legacy?"],\n      }\n      where: {\n        operator: Equal,\n        path: ["inArticle", "Article", "title"]\n        valueText: "Barack Obama"\n      }\n    ) {\n      content\n      order\n      title\n    }\n  }\n}\n```\n\nSo Weaviate already has a strong solution to long documents in play. However, what if we are searching through Scientific Papers, Legal contracts, or Screenplays such that we need to make long-range references between the Paragraphs?\n\nIn this case, Ref2Vec can be used to average the vectors that represent each **Paragraph** to form the representation of the referencing **Article Class**. In other words, each Article instance would refer to constituent Paragraph instances, and the Ref2Vec module would calculate the vector of the Article as the centroid of the Paragraph vectors. We can then search directly through these Articles with an aggregated vector representation from each Wikipedia Article, thus helping to identify full articles that best match the query.\n\n## More Coming Soon\nWe are very excited about the potential of Ref2Vec, and how it leverages existing symbolic data to augment vector searches in a new way. One of my favorite articles about Weaviate is Bob van Luijt\'s ["The AI-First Database Ecosystem"](/blog/semantic-search-with-wikipedia-and-weaviate). In this article, Bob describes emerging **waves** of database technology; from SQL, to NoSQL, and now, AI-first databases that focus "on data that is processed by a machine learning model first, where the AI models help in processing, storing and searching through the data as opposed to traditional ways".\n\nAlthough Weaviate puts Machine Learning data representations first, **this doesn\'t mean we discard symbolic data and many features of previous systems**. Rather, we are actively searching for how symbolic data can improve neural functionality and vice versa.\n\nWeaviate is a database that supports data structures like inverted index structures of categorical properties. Weaviate can integrate symbolic properties such as "colour" in the [HNSW vector search algorithm](https://towardsdatascience.com/effects-of-filtered-hnsw-searches-on-recall-and-latency-434becf8041c) to enable more efficient and guided search. This is called **pre-filtering** to describe applying the symbolic filter prior / during the search rather than simply after the nearest neighbors have been returned in **post-filtering**. Weaviate has clear applications of symbolic **properties** in vector search, but we have another symbolic data type that we hadn\'t yet leveraged in vector search – **Relational Structure**.\n\nRef2Vec-Centroid goes some way to harness the joint power of vector search **combined with** relational structure, by making it easier to derive object vectors from relationships. As you have seen above, we think Ref2Vec can add value for use cases such as recommendations, re-ranking, overcoming the cold start problem and representing long objects. We are also excited to see what you build with Ref2Vec, and excited to build on this module with its future iterations.\n\nSpeaking of which, we have another blog post coming soon on the development directions of Ref2Vec for the future. We will discuss topics such as **collaborative filtering**, **multiple centroids**, **graph neural networks**, and more on **re-ranking** with Ref2Vec. Stay tuned!\n\n\nimport WhatNext from \'/_includes/what-next.mdx\'\n\n\n',
            category: ["Blog"],
            uuid: "5b07f07b-2b21-4d89-bf46-f40312c826c6",
            collection_name: "Weaviate_blogs",
            chunk_spans: [
              {
                start: 9567,
                end: 10369,
                uuid: "e20bb3a9-b143-5b38-8ad9-27ca7b7287d3",
              },
            ],
          },
          {
            title: "Blog History-of-weaviate",
            content:
              '\nIn this article, I want to share the history of Weaviate, how the concept was born, and where we are heading towards in the near future.\n\n## A World of Wonders called Natural Language Processing\nSomewhere early 2015 I was introduced to the concept of word embeddings through the publication of an article that contained a machine-learning algorithm to turn individual words into embeddings called [GloVe](https://nlp.stanford.edu/projects/glove/).\n\n### Example of an embedding\n\n```txt\nsquarepants 0.27442 -0.25977 -0.17438 0.18573 0.6309 0.77326 -0.50925 -1.8926\n0.72604 0.54436 -0.2705 1.1534 0.20972 1.2629 1.2796 -0.12663 0.58185 0.4805\n-0.51054 0.026454 0.20253 0.32844 0.72568 1.23 0.90203 1.1607 -0.39605 0.80305\n0.16373 0.053425 -0.65308 1.0607 -0.29405 0.42172 -0.45183 0.57945 0.20217\n-1.3342 -0.71227 -0.6081 -0.3061 0.96214 -1.1097 -0.6499 -1.1147 0.4808 0.29857\n-0.30444 1.3929 0.088861\n```\n\nIf you are new to the world of word embeddings, a metaphor to understand them is in the form of a supermarket. The supermarket itself is a space in which products are stored based on the category they are in. Inside, you can find an apple by moving your shopping cart to the right coordinates in the fruit section and when you look around you, you\'ll find similar products like oranges, limes, bananas, etcetera, and you also know that a cucumber will be closer by than washing powder.\n\n\nThis is the same way a word embedding is structured. All the coordinates combined represent a multidimensional hyperspace (often around 300 dimensions) and words that have a similar meaning are more closely related to each other, like similar products in the store.\n\nBeing able to represent words in a space gives you a superpower, because it allows you to calculate with language! Instead of creating algorithms to understand language, it is now possible to simply look up what is in the neighborhood in the space.\n\n## How to semantically store data objects\nWhile working on software projects in my day-to-day life, I noticed that one of the most recurring challenges presented itself in naming and searching. How would we call certain objects and how could we find data that was structured in different ways? I fell in love with the semantic web but the challenge I saw there, was the need to have people agree on naming conventions and standards.\n\nThis made me wonder, what if we wouldn\'t have to agree on this any more? What if we could just store data and have the machine figure out the concept that your data represents?\n\nThe validation of the concept was chunked up into three main sections that were validated one by one.\n\n1. Can one get more context around a word by moving through the hyperspace? If so;\n1. Can one keep semantic meaning by calculating a centroid of a group of words (e.g., "thanks for the sushi last week")? If so;\n1. Can this be done fast without retraining the ML model?\n\nFinding more context around a word has to do with a concept called disambiguation. Take for example the word "apple". In the hyperspace, if you look for other words in the neighborhood, you will find words related to apple the fruit (e.g., other fruits, juices, etcetera) but also Apple the company (iPhone, Macintosh, and other concepts related to the company).\n\nTo validate if we could disambiguate the word "apple" the following simple step was taken. What if we looked for all the words that are in the neighborhood of the space in between "apple" and "fruit"? Turns out the results are way better! We can disambiguate by moving through the hyperspace while using individual words as beacons to navigate.\n\n![Vector Space](./img/vector-space.jpg)\n\nIn the next step, the goal was to validate if we could keep semantic meaning when storing a data object in the hyperspace by calculating the centroid using the individual words as beacons. We did that as follows, the title of this Vogue article: "Louis Vuitton\'s New Capsule with League of Legends Brings French High Fashion to Online Gaming — and Vice Versa".\n\nIf we look up the vector positions for the individual words (Louis, Vuitton, new, capsule, etc.) and place a new beacon in the center of the space of those vector positions, can we find the article by searching for "haute couture"? This turns out to work as well! Of course, through time, the centroid calculation algorithm in Weaviate has become way more sophisticated, but the overall concept is still the same.\n\n> By validating the above two assumptions, we knew that we could almost instantly store data objects in a semantic space rather than a more traditional row-column structure or graph. This allows us to index data based on its meaning.\n\nAlthough we had validated the assumptions of the semantic concepts, it was not enough to create an actual semantic search engine. Weaviate also needed a data model to represent these results.\n\n## Things Rather Than Strings\nIn September 2017 I wrote a [blog post](https://medium.com/bob-van-luijt/semantic-internet-of-things-42811e1ca7a7) about the overlap between the internet of things and the semantic web. IoT focuses on physical objects (i.e., "things") and the semantic web focuses on the mapping of data objects that represent something (a product, transaction, car, person, etcetera) which at the highest level of abstraction, are also "things".\n\nI wrote this article because, in January 2016, I was invited as part of the Google Developer Expert program in San Francisco, to visit the Ubiquity Conference. A conference where, back then, Google\'s Weave and Brillo were introduced to the public.\n\nWeave was the cloud application built around Brillo, but it piqued my interest because it focused on "things", how you defined them, and actions that you could execute around them. The very first iteration of Weaviate focused on exactly this: "Could Weave be used to define other things than IoT devices like transactions, or cars, or any other things?". In 2017 Google deprecated Weave and renamed Brillo to Android Things but the concept for Weaviate stayed.\n\nFrom the get-go, I knew that the "things" in Weaviate should be connected to each other in graph format because I wanted to be able to represent the relationships between the data objects (rather than flat, row-based information) in an as simple and straightforward manner as possible.\n\n> This search led to the RDF structure used by schema.org, which functioned as an inspiration for how to represent Weaviate\'s data objects.\n\nWeaviate is not per se RDF- or schema.org-based, but is definitely inspired by it. One of the most important upsides of this approach was that we could use GraphQL (the graph query language which was entering the software stage through Facebook open-sourcing it) to represent the data inside Weaviate.\n\nWith the concept of realtime vectorization of data objects and RDF-like representation of Weaviate objects in GraphQL, all the ingredients to turn Weaviate into the search graph that it currently is, were present.\n\n## The Birth of the Weaviate Search Graph\nBy the end of 2018, I entered Weaviate into a startup accelerator program in The Netherlands. A place where I had the time to build a team around Weaviate that could help get the software to production and create a business model around the open-source project (the startup became: SeMI Technologies, which is short for Semantic Machine Insights).\n\nWhen the team started, Weaviate was more of a traditional graph where the semantic (NLP) element was a feature rather than the core architecture. But when we started to learn how powerful the out-of-the-box semantic search was and the role that embeddings play in day-to-day software development (i.e., a lot of machine learning models create embeddings as output), the team decided that we wanted to double down on the NLP part and vector storage, creating a unique open-source project, which could be used as a semantic search engine. The Weaviate Search Graph was born.\n\n## How people use it today\nOne of the coolest things about an open-source community and users of the software is to see how people use it and what trends you can see emerge around implementations. The core features of Weaviate are the semantic search element and the semantic classification, which are used in a variety of ways and industries.\n\nExamples of implementations include: classification of invoices into categories, searching through documents for specific concepts rather than keywords, site search, product knowledge graphs, and many other things.\n\n## The Future\nWeaviate will stay fully open source for the community to use. The team is growing to accelerate building Weaviate and supporting users. We are releasing new features very frequently, like new vector indexes and search pipeline features, and Weaviate Cloud and Weaviate Query App.\n\n![Weaviate Console](./img/weaviate-console.jpg)\n\n## Listen to Bob\'s story at the Open Source Data\nWant to learn more about the background of Vector Search and how the ecosystem is developing? [Listen to Sam Ramji from DataStax interviewing Bob van Luijt about Vector Search and the AI stack.](https://www.datastax.com/resources/podcast/vector-search-ai-stack-more-bob-van-luijt).\n\n\nimport WhatNext from \'/_includes/what-next.mdx\'\n\n\n',
            category: ["Blog"],
            uuid: "6782b986-40ac-44eb-a2ec-c9c9625df86e",
            collection_name: "Weaviate_blogs",
            chunk_spans: [
              {
                start: 8131,
                end: 8792,
                uuid: "95b11e68-0d0c-54aa-a931-beadcf804246",
              },
              {
                start: 7360,
                end: 8279,
                uuid: "0c28fa58-af82-5e00-af93-c381912b97a7",
              },
              {
                start: 5916,
                end: 6754,
                uuid: "a6018b45-3d2a-58f1-83ce-9c5281a8575a",
              },
            ],
          },
          {
            title: "Blog Ai-native-infrastructure",
            content:
              "![AI-native infrastructure](./img/hero.png)\n\nIt was a beautiful fall morning in Orlando when I left the Grand Floridian, headed for the Gartner IT Symposium aboard the shuttle bus. I was eager to catch the keynote, though I hadn't studied who was speaking. Walking into the session, I found myself watching Jensen Huang, NVIDIA's CEO, in a fireside chat with Gartner's Daryl Plummer. Though I'd missed the first half, what I heard next made up for it: \"Vectorize all of your data.\"\n\nThis statement resonated deeply, not just because of its simplicity but because it underscored a fundamental shift in how we think about data and AI in the enterprise. The rapid evolution of generative AI has ushered in a new era—one where traditional data infrastructures no longer suffice.\n\n### The collapse of traditional, CRUD-based applications\n\nFast forward a few months. I'm sitting with Weaviate's co-founder, visionary and CEO [Bob van Luijt](https://www.linkedin.com/in/bobvanluijt/), discussing how the AI-native world will force every application to be rebuilt from the ground up. We shared a conviction that traditional CRUD-based apps would give way to AI-native agentic applications, with [vector databases](/blog/what-is-a-vector-database) like Weaviate at their core.\n\nShortly after, Satya Nadella, Microsoft’s CEO, made headlines with his own provocative statement on how traditional business applications are becoming obsolete. His vision aligned perfectly with what Bob and I had been discussing. His reasoning? In the AI-native era, business logic is migrating from hardcoded rules to autonomous AI agents capable of orchestrating operations across multiple systems. In this paradigm, traditional applications (reliant on static CRUD operations) are no match for agentic AI systems. \n\n### The Rise of Agentic AI: What it means for the enterprise \n\nOver the past few years, large language models and generative AI have completely changed how enterprises interact with their data, moving from static search results to systems that generate context-aware insights on demand. We’re now entering the age of Agentic AI—where AI doesn’t stop at giving answers; it continuously learns and takes action.\n\nJust last week, OpenAI unveiled Operator, an AI agent that can take actions directly through a web browser, acting on behalf of users in real-world scenarios. In one demo, the agent found and made a reservation at a local restaurant based on user preferences. In another, it ordered groceries from a delivery service based on a recipe. \n\nThese recent innovations offer a glimpse into AI's future, but what do they mean for enterprises looking to stay ahead of the curve? [Gartner recently predicted](https://www.gartner.com/en/articles/intelligent-agent-in-ai) that by 2028, 33% of enterprise software applications will include agentic AI, up from less than 1% in 2024, enabling 15% of day-to-day work decisions to be made autonomously.\n\nThere’s no doubt that the next three years will be transformative, but conversations with customers, analysts, and industry leaders reveal a clear consensus: general-purpose autonomous agents are still far from practical in the enterprise. This is due to both governance risks and technical limitations. The real opportunity in the near-term lies in deploying specialized AI agents for well-defined tasks and workflows. Use cases across customer support, software engineering, and data management and enrichment —where workflows are structured and early prototypes show strong potential—can deliver immense enterprise value and human productivity gains in the near-term.\n\n### Why you need an AI-native vector database \n\nThe ability to process, retrieve, and learn from unstructured and multimodal data at scale is a core requirement of agentic AI systems. Traditional databases were not designed for this complexity. Instead, AI-native vector databases have emerged as critical infrastructure for organizations seeking to enable these capabilities.\n\nWeaviate is an open-source AI-native database that empowers AI builders with: \n\n* **Scalable AI-Native Architecture:** Designed specifically for AI workloads, Weaviate delivers unparalleled scalability and performance, handling billions of vectors with ease.  \n    \n* **Real-time Semantic Search:** Beyond basic vector similarity, Weaviate incorporates hybrid techniques to ensure relevant and precise results. Real-time ingestion and querying help AI agents quickly adapt to new information.   \n    \n* **Integration with Agentic Frameworks:** Weaviate works with popular LLMs and agent tools like [LangChain](https://weaviate.io/developers/integrations/llm-agent-frameworks/langchain) and [LlamaIndex](https://weaviate.io/developers/integrations/llm-agent-frameworks/llamaindex), making it easier to build and deploy agentic workflows. \n\n* **Weaviate Agents:** Integrate new insights directly into the database, transform existing data, and improve agentic application intelligence over time.\n\n* **Governance, Compliance, and Security:** Flexible deployment, multi-tenancy, and strong security controls help you run agentic AI safely and meet enterprise standards without added complexity.\n\nJensen Huang's directive to \"vectorize all your data\" isn't just a passing trend – it's an imperative for survival in the AI era. As traditional business applications collapse and agentic AI becomes the new center of gravity for enterprise software, more organizations will adopt AI-native infrastructure for their use cases. \n\nWhy Weaviate? Because true enterprise readiness requires more than just [vector search](/blog/vector-search-explained). It demands battle-tested reliability, scalable architecture that can handle billions of vectors, seamless model integration, and the ability to support complex agentic architectures. Weaviate delivers on all these fronts while maintaining the speed and flexibility that modern AI applications demand.\n\nThe future speaks in vectors, and that future runs on Weaviate. For enterprises looking to thrive in the AI-native era, Weaviate offers a foundation for innovation, adaptability, and scalable intelligence. Together, we’re not just building software—we’re redefining what it can do.\n\nimport WhatNext from '/_includes/what-next.mdx'\n\n\n",
            category: ["Blog"],
            uuid: "3209b040-0285-45b6-9af1-a7105a9c185a",
            collection_name: "Weaviate_blogs",
            chunk_spans: [
              {
                start: 3794,
                end: 4286,
                uuid: "ebcc699b-fb35-5538-baa8-4c0fbedab94c",
              },
            ],
          },
          {
            title: "Blog Chicago-roadshow-recap",
            content:
              "\nIn July we stopped by the Windy City along with our friends from Innovative Solutions and Morningstar to host another roadshow event. Even though this was our first-ever visit to Chicago, our space was packed to the brim with AI enthusiasts asking awesome questions of our presenters and completing our hands-on training in the second half of the day.\n\nBen Barrett, Head of Technology, and Aisis Julian, Senior Software Engineer at [Morningstar](https://www.morningstar.com/), shared their journey in building an intelligence engine platform for financial data. They focused on the evolution of the platform, emphasizing corpus management as a critical feature that allows Morningstar to leverage its extensive data across multiple applications. The talk showed how Weaviate has been instrumental in enhancing the precision and flexibility of their generative AI applications.\n\n> Amazingly, our team was able to build this entire pipeline very quickly with Weaviate's Python client and their model provider integration so that we could have a seamless implementation and configuration of embedding models.\n\n> *Aisis Julian, Senior Software Engineer, Morningstar* \n\n\n\n    \n\n\n\n### Key Takeaways:\n* **Intelligence Engine Platform**: Built with Weaviate, this platform enables scalable and flexible management of financial research data, supporting multiple AI applications across Morningstar.\n\n* **Corpus management**: The platform's corpus management system allows for dynamic and context-aware document chunking, improving the relevance and accuracy of retrieval-augmented generation (RAG) applications.\n\n* **Cited source transparency**: Enhancing transparency and accuracy, Morningstar's system ensures that AI-generated answers are backed by verifiable and trusted sources, aiding user confidence in the output.\n\n* **Ease-of-use, versatility, and scalability**: The ability to support multiple use cases—from search engines to tailored AI applications—and get them up-and-running quickly,demonstrates the versatility and scalability of Weaviate's capabilities in handling large and diverse data sets.\n\nAnthony Loss, Lead Solutions Architect at [Innovative Solutions](https://innovativesol.com/), provided an insightful presentation on how Innovative uses Weaviate’s vector database within AWS environments to enhance generative AI solutions for their clients. He shared the story of a recent customer in the call center industry for whom Innovative deployed a two-pronged solution involving live call analytics and digital voice agents. \n\n\n    \n\n\n\n### Key takeaways:\n* **Weaviate’s scalability**: Weaviate integrates seamlessly within AWS environments and scales to support large use cases with ease, making it a preferred choice for deploying AI-driven solutions.\n\n* **Innovative’s AI capabilities**: Innovative Solutions leverages advanced AI technologies, including IBM Watson on AWS, to enhance real-time customer experience monitoring and interaction flows.\n\n* **Case study success**: Innovative successfully implemented a complex solution for a call center-focused customer, demonstrating the practical and powerful application of Weaviate's technology in improving customer satisfaction and operational efficiency.\n\nInterested in joining us in person? Keep an eye on our [events page](https://weaviate.io/community/events) to see when we’re headed to your city! \n\n\n",
            category: ["Blog"],
            uuid: "b8bf019c-6815-4420-ac51-14e6290d3374",
            collection_name: "Weaviate_blogs",
            chunk_spans: [
              {
                start: 1605,
                end: 2569,
                uuid: "d00f8ce5-772e-53e0-bc0c-dd9b74e8e343",
              },
            ],
          },
          {
            title: "Blog Understand-your-unstructured-data",
            content:
              "\n## Intro\nThese days, more and more organizations are adopting a data-driven culture. Business processes and customer experience benefit from good data collection, management and analysis. But in order to really benefit from available data, it is essential to also understand the unstructured data, like free text in PDF documents, emails, invoices or voice transcriptions. Unstructured data is especially hard to index, manage and understand. Since around [80% of all data is unstructured](https://www.forbes.com/sites/forbestechcouncil/2019/01/29/the-80-blind-spot-are-you-ignoring-unstructured-organizational-data/), it is hard to actually search and retrieve insights from most of the data.\n\nThe Weaviate vector database unlocks the potential of unstructured data. Searching by fuzzy terms and classification of rich data like free text becomes possible with Weaviate. It uses AI-driven indexing and search technologies to enable real-time text processing. With machine learning methods, Weaviate automatically classifies texts. Finding information you are looking for and providing recommendations is possible because knowledge and information is placed in context.\n\n## How does Weaviate work?\nData usually refers to something in the real world. Traditional databases and search engines often struggle with understanding the context of data, a situation or a search query. The context of data is important, because it enables storage and search by fuzzy concepts instead of exact matching keywords. Weaviate automatically places concepts and words in relation to its context by using machine learning. It understands that the Eiffel Tower is a landmark in Paris, and will place these concepts closely together in the database model. Showing [orange tompouces](https://en.wikipedia.org/wiki/Tompouce) when looking for treats around King's day in the Netherlands is an example of finding concepts related to the context.\n\n## Example use cases\nNow let's get more serious than landmarks and holiday treats (although we should agree that tompouces are essential during King's day), and find out how also your business could benefit from search and classification of unstructured data.\n\n## Automatic classification\nData classification is often done manually or by expensive external data science teams. ERP (enterprise resource planning) and supply chain management systems rely on correct classification of for example employees' travel expenses or ingredient labeling of product packages. Automatic classification by Weaviate reduces manual classification errors and eliminates expensive, single-to-use classification applications. Automatic classification can also be applied to cybersecurity and event management, where intervention on threats and riskful events should be taken real-time. Current platforms deal with very large amounts of streaming data, consisting of mostly free text. Weaviate can automatically recognize threats in free text, and classify if and which mitigation should be taken. With Weaviate this can be achieved near real-time, even on a very large scale.\n\n## Semantic search\nTraditional search systems return items that have an exact match with the search terms. This means that searching through your emails for ‘reimbursement' will skip all results about ‘compensation'. Searching for ‘science fiction' in a traditional book search engine, might lead to anything related to ‘science' or ‘fiction' so this would include ‘neuroscience' but not ‘a book about the future'. Weaviate uses semantic search, and matches search results to the user's intent through contextual meaning. For e-commerce websites this means that people searching for ‘jumpers' will also see ‘sweatshirts' simply because their contextual meaning is the same although the keywords do not match.\n\nSee how automatically placing orange tompouces in the context of King's day might thus actually lead to upselling your products and happier customers? Now there's certainly also potential hidden in the majority of your data. Think about how an AI-driven vector-search can unlock this from your organization's data!\n\n\nimport WhatNext from '/_includes/what-next.mdx'\n\n\n",
            category: ["Blog"],
            uuid: "5483d153-f666-457f-9287-46ad392c60f4",
            collection_name: "Weaviate_blogs",
            chunk_spans: [
              {
                start: 769,
                end: 1250,
                uuid: "eb8ccaaa-36c8-507d-9fbc-25d2065a6938",
              },
            ],
          },
        ],
        metadata: {
          collection_name: "Weaviate_blogs",
          display_type: "document",
          needs_summarising: false,
          query_text: "what is Weaviate?",
          query_type: "hybrid",
          chunked: true,
          query_output: {
            target_collections: [
              "Weaviate_documentation",
              "ELYSIA_CHUNKED_weaviate_blogs__",
            ],
            search_type: "hybrid",
            search_query: "what is Weaviate?",
            sort_by: null,
            filter_buckets: null,
            limit: 10,
          },
          code: {
            language: "python",
            title: "Query",
            text: "collection.query.hybrid(\n    query='what is Weaviate?',\n    limit=10\n)",
          },
        },
        code: {
          language: "python",
          title: "Query",
          text: "collection.query.hybrid(\n    query='what is Weaviate?',\n    limit=10\n)",
        },
      },
    },
    {
      type: "text",
      id: "tex-648f906a-fcd5-40b7-a8eb-6d73c4c97229",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "9eecf0fb-b3e2-4272-b8d3-050e0f2e7d95",
      query_id: "b4c8ce36-0989-436e-966e-962efe8dacd3",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will now summarize the information I found in the Weaviate documentation and blog posts to answer your question.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-0b8fd1ee-1de8-4a8a-9f31-5181b7f4e5b1",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "9eecf0fb-b3e2-4272-b8d3-050e0f2e7d95",
      query_id: "b4c8ce36-0989-436e-966e-962efe8dacd3",
      payload: {
        type: "text_with_citations",
        metadata: {
          title: "Weaviate: An AI-Native Vector Database",
        },
        objects: [
          {
            text: "Weaviate is an open-source, AI-native vector database designed for AI workloads, offering scalability and performance for handling billions of vectors. It facilitates real-time semantic search and classification of data, using AI-driven indexing and search technologies to process text and classify data automatically with machine learning.",
            ref_ids: [
              "query_Weaviate_blogs_0_0",
              "query_Weaviate_blogs_0_1",
              "query_Weaviate_blogs_0_3",
            ],
          },
          {
            text: "\n\nWeaviate supports various data structures, including inverted index structures for categorical properties, and can integrate symbolic properties to enhance search efficiency. It is cloud-native and modular, allowing teams to import data objects alongside existing vector positions, and offers optional modules for text, images, and other media types.",
            ref_ids: ["query_Weaviate_blogs_0_2", "query_Weaviate_blogs_0_4"],
          },
          {
            text: "\n\nKey features include semantic search and classification, which are applied across various industries for tasks such as invoice categorization and conceptual document searching. Weaviate is versatile and scalable, supporting multiple use cases from search engines to AI applications.",
            ref_ids: [
              "query_Weaviate_blogs_0_5",
              "query_Weaviate_blogs_0_6",
              "query_Weaviate_blogs_0_9",
            ],
          },
          {
            text: "\n\nWeaviate was inspired by the RDF structure used by schema.org and uses GraphQL to represent the data. It can be integrated into platforms like Boomi and Dynamiq, enhancing capabilities within low-code environments and streamlining research processes.",
            ref_ids: [
              "query_Weaviate_blogs_0_7",
              "query_Weaviate_documentation_0_6",
              "query_Weaviate_documentation_0_9",
            ],
          },
          {
            text: "\n\nWeaviate also supports private and secure solutions where data doesn't leave the organization, and it enhances transparency by ensuring AI-generated answers are backed by verifiable sources.",
            ref_ids: ["query_Weaviate_blogs_0_8", "query_Weaviate_blogs_0_6"],
          },
        ],
      },
    },
    {
      type: "suggestion",
      id: "dd824625-0b98-4b42-96b5-66a179939410",
      conversation_id: "9eecf0fb-b3e2-4272-b8d3-050e0f2e7d95",
      query_id: "b4c8ce36-0989-436e-966e-962efe8dacd3",
      user_id: "com-55ffea04-c8ec-4daf-811b-6c6abe9e09e0",
      payload: {
        error: "",
        suggestions: [],
      },
    },
  ],
};
