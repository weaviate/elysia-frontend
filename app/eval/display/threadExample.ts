/* eslint-disable @typescript-eslint/no-explicit-any */
export const threadResponse: any = {
  id: "12345",
  query: "Are there any conversations about Python packages?",
  messages: [
    {
      type: "User",
      id: "b203293b-e02d-4ab4-8198-91c21ea4f0c0",
      query_id: "93624d05-585a-4111-b9c5-fa14eceb628b",
      conversation_id: "8d7a4c89-f6a1-4630-a310-80e64f2e528b",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["Show me the latest conversation of edward"],
      },
    },
    {
      type: "text",
      id: "tex-d600734a-b500-4a8c-b89d-cf1777011f7d",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "8d7a4c89-f6a1-4630-a310-80e64f2e528b",
      query_id: "93624d05-585a-4111-b9c5-fa14eceb628b",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will now query the `Example_verba_slack_conversations` and `Example_verba_email_chains` collections to find the latest messages from Edward.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-1f775e59-967e-437f-8918-a5b1d84019a8",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "8d7a4c89-f6a1-4630-a310-80e64f2e528b",
      query_id: "93624d05-585a-4111-b9c5-fa14eceb628b",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: 'I\'m applying a filter to only include messages from "Edward" and sorting the results by timestamp to show the latest conversations first.',
          },
        ],
      },
    },
    {
      type: "result",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "8d7a4c89-f6a1-4630-a310-80e64f2e528b",
      query_id: "93624d05-585a-4111-b9c5-fa14eceb628b",
      id: "res-ca8eb706-f805-426d-a76f-c7450f334875",
      payload: {
        type: "conversation",
        objects: [
          {
            conversation_id: 22,
            messages: [
              {
                conversation_id: 22,
                content:
                  "Hey team, I've noticed our Weaviate disk usage is almost at 90%. Any thoughts on how to increase the disk limit?",
                author: "Zara",
                timestamp: "2024-09-26T09:12:33Z",
                uuid: "06ae35b4-2c0c-5dbc-9bdf-e9ed4e18a53f",
                relevant: false,
              },
              {
                conversation_id: 22,
                content:
                  "That's a good point, Zara. Even though we have 1TB free, it seems the system is still reading it as full. Maybe we should check the configuration settings?",
                author: "Edward",
                timestamp: "2024-09-26T09:15:45Z",
                uuid: "742fb7ab-1119-5891-9aa7-ba81b1ab277a",
                relevant: false,
              },
              {
                conversation_id: 22,
                content:
                  "I think there's a parameter in the Weaviate configuration that needs adjusting. We might have to look into the documentation for any disk space limits.",
                author: "Kaladin",
                timestamp: "2024-09-26T09:18:12Z",
                uuid: "1e95a0d2-880a-53d8-9ef0-744cada1d835",
                relevant: false,
              },
              {
                conversation_id: 22,
                content:
                  "Good idea, Kaladin! Also, we might want to consider increasing the threshold for alerts if we're not actually running out of space.",
                author: "Zara",
                timestamp: "2024-09-26T09:20:30Z",
                uuid: "8ba44806-a8aa-5d32-8346-65e9f69ffe72",
                relevant: false,
              },
              {
                conversation_id: 22,
                content:
                  "Definitely! I can dig into the logs and see if there are any underlying issues causing this read-only state while we have space.",
                author: "Edward",
                timestamp: "2024-09-26T09:23:10Z",
                uuid: "6f45d340-24db-5e25-8104-2a4f98e2260d",
                relevant: true,
              },
              {
                conversation_id: 22,
                content:
                  "Let's regroup after we check these things. I’m sure we can find a workaround or solution together!",
                author: "Kaladin",
                timestamp: "2024-09-26T09:25:55Z",
                uuid: "791c7ea7-ec46-5ab0-9f25-41f78fb2f8c5",
                relevant: false,
              },
            ],
          },
          {
            conversation_id: 22,
            messages: [
              {
                conversation_id: 22,
                content:
                  "Hey team, I've noticed our Weaviate disk usage is almost at 90%. Any thoughts on how to increase the disk limit?",
                author: "Zara",
                timestamp: "2024-09-26T09:12:33Z",
                uuid: "06ae35b4-2c0c-5dbc-9bdf-e9ed4e18a53f",
                relevant: false,
              },
              {
                conversation_id: 22,
                content:
                  "That's a good point, Zara. Even though we have 1TB free, it seems the system is still reading it as full. Maybe we should check the configuration settings?",
                author: "Edward",
                timestamp: "2024-09-26T09:15:45Z",
                uuid: "742fb7ab-1119-5891-9aa7-ba81b1ab277a",
                relevant: true,
              },
              {
                conversation_id: 22,
                content:
                  "I think there's a parameter in the Weaviate configuration that needs adjusting. We might have to look into the documentation for any disk space limits.",
                author: "Kaladin",
                timestamp: "2024-09-26T09:18:12Z",
                uuid: "1e95a0d2-880a-53d8-9ef0-744cada1d835",
                relevant: false,
              },
              {
                conversation_id: 22,
                content:
                  "Good idea, Kaladin! Also, we might want to consider increasing the threshold for alerts if we're not actually running out of space.",
                author: "Zara",
                timestamp: "2024-09-26T09:20:30Z",
                uuid: "8ba44806-a8aa-5d32-8346-65e9f69ffe72",
                relevant: false,
              },
              {
                conversation_id: 22,
                content:
                  "Definitely! I can dig into the logs and see if there are any underlying issues causing this read-only state while we have space.",
                author: "Edward",
                timestamp: "2024-09-26T09:23:10Z",
                uuid: "6f45d340-24db-5e25-8104-2a4f98e2260d",
                relevant: false,
              },
              {
                conversation_id: 22,
                content:
                  "Let's regroup after we check these things. I’m sure we can find a workaround or solution together!",
                author: "Kaladin",
                timestamp: "2024-09-26T09:25:55Z",
                uuid: "791c7ea7-ec46-5ab0-9f25-41f78fb2f8c5",
                relevant: false,
              },
            ],
          },
          {
            conversation_id: 84,
            messages: [
              {
                conversation_id: 84,
                content:
                  "Hey team, I'm running into a connection issue with Verba when trying to use it with Ollama and Weaviate. Anyone else experienced this?",
                author: "Xaden",
                timestamp: "2024-08-01T14:01:15Z",
                uuid: "075045a6-4ffe-5417-8254-623ab229042b",
                relevant: false,
              },
              {
                conversation_id: 84,
                content:
                  "Yes, I had a similar problem. Have you checked if Ollama is actually running on the expected port? You might want to verify the service status.",
                author: "Edward",
                timestamp: "2024-08-01T14:03:42Z",
                uuid: "965db95a-23e2-5016-93c5-808dfa479d8d",
                relevant: true,
              },
              {
                conversation_id: 84,
                content:
                  "Also, double-check your .env file. Sometimes the environment variables can get messed up, especially if you've changed configurations recently.",
                author: "Zara",
                timestamp: "2024-08-01T14:05:10Z",
                uuid: "0b9ee981-ed64-52ac-b0c9-2df50c6a5366",
                relevant: false,
              },
              {
                conversation_id: 84,
                content:
                  "Thanks, I'll look into that. I did see some errors related to the modules not being present. Do you think that could be causing the issue?",
                author: "Xaden",
                timestamp: "2024-08-01T14:06:55Z",
                uuid: "d509b343-adca-5d17-b805-7dcfd0fc4cc7",
                relevant: false,
              },
            ],
          },
          {
            conversation_id: 102,
            messages: [
              {
                conversation_id: 102,
                content:
                  "Hey team, has anyone else run into that AttributeError with InputText while installing verba on M1 Macs?",
                author: "Edward",
                timestamp: "2024-06-27T15:00:00Z",
                uuid: "c94f66df-8b5a-5065-9a83-d5a33467cd06",
                relevant: false,
              },
              {
                conversation_id: 102,
                content:
                  "I haven't experienced that specific error, but I did have issues related to PyTorch on my M1. Could it be related to the Python environment you're using?",
                author: "Zara",
                timestamp: "2024-06-27T15:05:35Z",
                uuid: "0e0bee22-d9d0-5644-bb71-f0a14fe4bd8a",
                relevant: false,
              },
              {
                conversation_id: 102,
                content:
                  "That's a good point, Zara. Sometimes using a virtual environment can help. Have you tried setting one up for your project, Edward?",
                author: "Danny",
                timestamp: "2024-06-27T15:10:12Z",
                uuid: "e54a41a4-9a53-5825-89ed-58cdb5590918",
                relevant: false,
              },
              {
                conversation_id: 102,
                content:
                  "Not yet, I was just using the global environment. Maybe I should give that a shot. Do you think I should also downgrade Python?",
                author: "Edward",
                timestamp: "2024-06-27T15:15:48Z",
                uuid: "6332ff98-adaf-5228-8c1a-5973d32394a0",
                relevant: true,
              },
              {
                conversation_id: 102,
                content:
                  "It could help! Some packages have compatibility issues with newer versions. Also, check if there are any specific dependencies that need adjusting.",
                author: "Zara",
                timestamp: "2024-06-27T15:21:04Z",
                uuid: "7e1b1527-0872-5a07-ad25-df3e8bfe483e",
                relevant: false,
              },
              {
                conversation_id: 102,
                content:
                  "Definitely worth investigating! Let us know if setting up a virtual environment changes anything.",
                author: "Danny",
                timestamp: "2024-06-27T15:25:30Z",
                uuid: "2ec5fcd2-a2cc-5b4e-99ff-73ab9d1b3039",
                relevant: false,
              },
            ],
          },
          {
            conversation_id: 102,
            messages: [
              {
                conversation_id: 102,
                content:
                  "Hey team, has anyone else run into that AttributeError with InputText while installing verba on M1 Macs?",
                author: "Edward",
                timestamp: "2024-06-27T15:00:00Z",
                uuid: "c94f66df-8b5a-5065-9a83-d5a33467cd06",
                relevant: true,
              },
              {
                conversation_id: 102,
                content:
                  "I haven't experienced that specific error, but I did have issues related to PyTorch on my M1. Could it be related to the Python environment you're using?",
                author: "Zara",
                timestamp: "2024-06-27T15:05:35Z",
                uuid: "0e0bee22-d9d0-5644-bb71-f0a14fe4bd8a",
                relevant: false,
              },
              {
                conversation_id: 102,
                content:
                  "That's a good point, Zara. Sometimes using a virtual environment can help. Have you tried setting one up for your project, Edward?",
                author: "Danny",
                timestamp: "2024-06-27T15:10:12Z",
                uuid: "e54a41a4-9a53-5825-89ed-58cdb5590918",
                relevant: false,
              },
              {
                conversation_id: 102,
                content:
                  "Not yet, I was just using the global environment. Maybe I should give that a shot. Do you think I should also downgrade Python?",
                author: "Edward",
                timestamp: "2024-06-27T15:15:48Z",
                uuid: "6332ff98-adaf-5228-8c1a-5973d32394a0",
                relevant: false,
              },
              {
                conversation_id: 102,
                content:
                  "It could help! Some packages have compatibility issues with newer versions. Also, check if there are any specific dependencies that need adjusting.",
                author: "Zara",
                timestamp: "2024-06-27T15:21:04Z",
                uuid: "7e1b1527-0872-5a07-ad25-df3e8bfe483e",
                relevant: false,
              },
              {
                conversation_id: 102,
                content:
                  "Definitely worth investigating! Let us know if setting up a virtual environment changes anything.",
                author: "Danny",
                timestamp: "2024-06-27T15:25:30Z",
                uuid: "2ec5fcd2-a2cc-5b4e-99ff-73ab9d1b3039",
                relevant: false,
              },
            ],
          },
        ],
        metadata: {
          collection_name: "Example_verba_slack_conversations",
          display_type: "conversation",
          needs_summarising: false,
          query_text: null,
          query_type: "filter_only",
          chunked: false,
          query_output: {
            target_collections: ["Example_verba_slack_conversations"],
            search_type: "filter_only",
            search_query: null,
            sort_by: {
              property_name: "message_timestamp",
              direction: "descending",
            },
            filter_buckets: [
              {
                filters: [
                  {
                    property_name: "message_author",
                    operator: "=",
                    value: "Edward",
                  },
                ],
                operator: "AND",
              },
            ],
            limit: 5,
          },
          code: {
            language: "python",
            title: "Query",
            text: "collection.query.fetch_objects(\n    filters=Filter.all_of([\n        Filter.by_property('message_author').equal('Edward')\n    ]),\n    limit=5,\n    sort=Sort.by_property(\n        'message_timestamp',\n        ascending=False\n    )\n)",
          },
        },
        code: {
          language: "python",
          title: "Query",
          text: "collection.query.fetch_objects(\n    filters=Filter.all_of([\n        Filter.by_property('message_author').equal('Edward')\n    ]),\n    limit=5,\n    sort=Sort.by_property(\n        'message_timestamp',\n        ascending=False\n    )\n)",
        },
      },
    },
    {
      type: "result",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "8d7a4c89-f6a1-4630-a310-80e64f2e528b",
      query_id: "93624d05-585a-4111-b9c5-fa14eceb628b",
      id: "res-b2095d2c-d6af-46d8-8ffb-d21cdedfbb1b",
      payload: {
        type: "conversation",
        objects: [
          {
            conversation_id: 27,
            messages: [
              {
                conversation_id: 27,
                content:
                  "Hello Support Team,\n\nI hope this message finds you well. I have recently started using your product and have encountered some challenges with its features. Specifically, I am having trouble understanding how to connect the application with external APIs effectively. Any guidance you could provide would be greatly appreciated.\n\nThank you!\n\nBest regards,\nXaden",
                author: "Xaden",
                timestamp: "2024-09-23T12:00:00Z",
                uuid: "47648d44-61ad-5f91-9eb4-f29361af0eab",
                relevant: false,
              },
              {
                conversation_id: 27,
                content:
                  "Dear Xaden,\n\nThank you for reaching out to us regarding your concerns. We appreciate your interest in our product. To connect the application with external APIs, you need to configure the settings in the .env file properly. Ensure that the API keys are inserted correctly and that the endpoints are accessible.\n\nIf you're still encountering issues, please let us know, and we can schedule a call to assist you further.\n\nKind regards,\nEdward",
                author: "Edward",
                timestamp: "2024-09-23T12:45:13Z",
                uuid: "d82d6072-4be1-5a50-9322-0b807a27dab5",
                relevant: true,
              },
              {
                conversation_id: 27,
                content:
                  "Hi Xaden,\n\nFollowing up on Edward's email, I wanted to add that it's crucial to check if the external API you're trying to connect to has any specific requirements or limitations. Sometimes, the format of the request can cause unexpected issues. Please feel free to share any error messages you receive, and we will gladly help you troubleshoot.\n\nLooking forward to your reply!\n\nRegards,\nDalinar",
                author: "Dalinar",
                timestamp: "2024-09-23T14:12:45Z",
                uuid: "e3701905-8440-54ac-a4da-81f4d2fff5d1",
                relevant: false,
              },
            ],
          },
          {
            conversation_id: 172,
            messages: [
              {
                conversation_id: 172,
                content:
                  "Dear Team,\n\nWe are excited to share the latest updates from Verba Chat. Our team has been working diligently to enhance user experience and efficiency. Stay tuned for more details on our upcoming features!\n\nBest regards,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-20T10:15:47Z",
                uuid: "929fb730-a9e8-509d-9f7c-08fc528dc66a",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hello Everyone,\n\nI just wanted to add that we are also rolling out new integrations with other services to make Verba Chat even more versatile. We appreciate your support and feedback as we implement these changes.\n\nKind regards,\nEdward",
                author: "Edward",
                timestamp: "2024-05-20T13:32:15Z",
                uuid: "c7516dd2-07f3-5715-aee5-5b02267a89ea",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hi Team,\n\nJust a quick note to remind you about our upcoming webinar where we will showcase the new features of Verba Chat. It’s a great opportunity to see everything in action and ask questions.\n\nLooking forward to seeing you all there!\nRegards,\nRavi",
                author: "Ravi",
                timestamp: "2024-05-20T15:45:32Z",
                uuid: "67d8accd-51d0-52a8-ba34-544f308341a4",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Dear All,\n\nWe appreciate your enthusiasm for the upcoming features! We are also gathering feedback from early testers, and it has been overwhelmingly positive. Thank you for your continued engagement.\n\nBest,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-20T18:10:05Z",
                uuid: "cd5d1d5d-56f8-58ec-8349-d9460c4946b1",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hello Team,\n\nI wanted to remind everyone that the feedback deadline for the new features is approaching. Please ensure your comments are submitted by the end of the week to be considered in the final rollout.\n\nBest regards,\nEdward",
                author: "Edward",
                timestamp: "2024-05-21T09:20:16Z",
                uuid: "de47852a-2ea3-5dc4-9c7d-0c9baa71004e",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hi All,\n\nJust following up on Edward’s message. Your insights are invaluable to us, and we want to ensure we address all concerns before the final release. Thank you for your contributions!\n\nKind regards,\nRavi",
                author: "Ravi",
                timestamp: "2024-05-21T12:05:44Z",
                uuid: "82e61409-2877-530e-b6d0-b6f1eba0d65a",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Dear Team,\n\nI’m thrilled to report that the new features are on track for release next month! Thank you all for your hard work and dedication throughout this process.\n\nBest,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-21T14:35:22Z",
                uuid: "71a9e2f8-03f7-5b2d-a0d1-ae1bad796f6a",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hello Everyone,\n\nAs we approach the release date, I encourage everyone to finalize their testing and provide any last-minute feedback. Your efforts are crucial to our success!\n\nRegards,\nEdward",
                author: "Edward",
                timestamp: "2024-05-21T16:55:38Z",
                uuid: "cccc15b3-6423-5fb1-b218-ebc40de2d7cf",
                relevant: true,
              },
              {
                conversation_id: 172,
                content:
                  "Hi Team,\n\nWe are planning a celebratory meeting to discuss our successful launch and future directions. I hope everyone can join us!\n\nBest,\nRavi",
                author: "Ravi",
                timestamp: "2024-05-21T19:30:10Z",
                uuid: "7afd255f-077a-5db7-8328-99da75c77266",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Dear Team,\n\nThank you all for your hard work and commitment. Looking forward to our meeting and celebrating our successes together!\n\nBest regards,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-22T09:15:00Z",
                uuid: "63d1c4ac-1111-5d92-a825-2247a710dc92",
                relevant: false,
              },
            ],
          },
          {
            conversation_id: 167,
            messages: [
              {
                conversation_id: 167,
                content:
                  "Hello Support Team,\n\nI hope this message finds you well. I recently started using your product and I have some questions regarding its capabilities and support options. I want to ensure I have the right resources available should I encounter any issues in the future.\n\nThank you in advance for your assistance!\n\nBest, \nXaden",
                author: "Xaden",
                timestamp: "2024-05-21T10:15:00Z",
                uuid: "2551c540-c45a-5749-a3b8-05ca0caa3187",
                relevant: false,
              },
              {
                conversation_id: 167,
                content:
                  "Hi Xaden,\n\nThank you for reaching out! We're glad to hear you're exploring our product. We offer extensive support through our documentation and community forums, and our team is always here to assist you with any inquiries you may have.\n\nIf you have specific features in mind that you would like to know more about, feel free to ask!\n\nKind regards,\nDalinar",
                author: "Dalinar",
                timestamp: "2024-05-21T10:45:30Z",
                uuid: "1f642d6f-17c4-5f1c-9e51-b7af3d11cf3a",
                relevant: false,
              },
              {
                conversation_id: 167,
                content:
                  "Dear Dalinar,\n\nI appreciate the quick response! I'm particularly interested in understanding how the product handles scalability and any potential limitations I should be aware of. Also, what resources do you recommend for troubleshooting common issues?\n\nLooking forward to your insights.\n\nRegards,\nXaden",
                author: "Xaden",
                timestamp: "2024-05-21T11:20:45Z",
                uuid: "270f28b6-dc2a-5f9d-930e-a96ab8f29069",
                relevant: false,
              },
              {
                conversation_id: 167,
                content:
                  "Hello Xaden,\n\nGreat questions! Our product is designed to scale efficiently, and we typically recommend leveraging our cloud solutions for larger deployments. For troubleshooting, we have a dedicated knowledge base that covers common scenarios, along with a community forum where you can find solutions contributed by other users.\n\nPlease let us know if you need further details!\n\nBest,\nEdward",
                author: "Edward",
                timestamp: "2024-05-21T12:05:22Z",
                uuid: "eaef6445-0aa4-56a5-9eab-88efaecb0b79",
                relevant: true,
              },
              {
                conversation_id: 167,
                content:
                  "Hi Edward,\n\nThank you for the detailed information! It's reassuring to know that there are solid resources available. I will definitely check out the knowledge base. Are there any upcoming webinars or training sessions that I could attend to gain more insight?\n\nThank you again!\n\nBest regards,\nXaden",
                author: "Xaden",
                timestamp: "2024-05-21T12:45:35Z",
                uuid: "911cd37b-0807-51f3-a8b8-b7abad976d5a",
                relevant: false,
              },
              {
                conversation_id: 167,
                content:
                  "Hi Xaden,\n\nYes, we regularly host webinars that cover various aspects of our product, including best practices for deployment and troubleshooting. I can add you to our mailing list so you won't miss any announcements. Please provide your preferred email for updates!\n\nKind regards,\nDalinar",
                author: "Dalinar",
                timestamp: "2024-05-21T13:30:12Z",
                uuid: "fee6b067-9876-55bc-8ae1-24f920f5f77b",
                relevant: false,
              },
              {
                conversation_id: 167,
                content:
                  "Hello Dalinar,\n\nThat sounds perfect! You can add me with the email address xaden@example.com. I appreciate all your help so far and I'm looking forward to the webinars.\n\nThanks once again!\n\nWarm regards,\nXaden",
                author: "Xaden",
                timestamp: "2024-05-21T14:15:50Z",
                uuid: "bc98dd92-5b89-50e8-b79a-b9f0cf919d7b",
                relevant: false,
              },
            ],
          },
          {
            conversation_id: 172,
            messages: [
              {
                conversation_id: 172,
                content:
                  "Dear Team,\n\nWe are excited to share the latest updates from Verba Chat. Our team has been working diligently to enhance user experience and efficiency. Stay tuned for more details on our upcoming features!\n\nBest regards,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-20T10:15:47Z",
                uuid: "929fb730-a9e8-509d-9f7c-08fc528dc66a",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hello Everyone,\n\nI just wanted to add that we are also rolling out new integrations with other services to make Verba Chat even more versatile. We appreciate your support and feedback as we implement these changes.\n\nKind regards,\nEdward",
                author: "Edward",
                timestamp: "2024-05-20T13:32:15Z",
                uuid: "c7516dd2-07f3-5715-aee5-5b02267a89ea",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hi Team,\n\nJust a quick note to remind you about our upcoming webinar where we will showcase the new features of Verba Chat. It’s a great opportunity to see everything in action and ask questions.\n\nLooking forward to seeing you all there!\nRegards,\nRavi",
                author: "Ravi",
                timestamp: "2024-05-20T15:45:32Z",
                uuid: "67d8accd-51d0-52a8-ba34-544f308341a4",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Dear All,\n\nWe appreciate your enthusiasm for the upcoming features! We are also gathering feedback from early testers, and it has been overwhelmingly positive. Thank you for your continued engagement.\n\nBest,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-20T18:10:05Z",
                uuid: "cd5d1d5d-56f8-58ec-8349-d9460c4946b1",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hello Team,\n\nI wanted to remind everyone that the feedback deadline for the new features is approaching. Please ensure your comments are submitted by the end of the week to be considered in the final rollout.\n\nBest regards,\nEdward",
                author: "Edward",
                timestamp: "2024-05-21T09:20:16Z",
                uuid: "de47852a-2ea3-5dc4-9c7d-0c9baa71004e",
                relevant: true,
              },
              {
                conversation_id: 172,
                content:
                  "Hi All,\n\nJust following up on Edward’s message. Your insights are invaluable to us, and we want to ensure we address all concerns before the final release. Thank you for your contributions!\n\nKind regards,\nRavi",
                author: "Ravi",
                timestamp: "2024-05-21T12:05:44Z",
                uuid: "82e61409-2877-530e-b6d0-b6f1eba0d65a",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Dear Team,\n\nI’m thrilled to report that the new features are on track for release next month! Thank you all for your hard work and dedication throughout this process.\n\nBest,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-21T14:35:22Z",
                uuid: "71a9e2f8-03f7-5b2d-a0d1-ae1bad796f6a",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hello Everyone,\n\nAs we approach the release date, I encourage everyone to finalize their testing and provide any last-minute feedback. Your efforts are crucial to our success!\n\nRegards,\nEdward",
                author: "Edward",
                timestamp: "2024-05-21T16:55:38Z",
                uuid: "cccc15b3-6423-5fb1-b218-ebc40de2d7cf",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hi Team,\n\nWe are planning a celebratory meeting to discuss our successful launch and future directions. I hope everyone can join us!\n\nBest,\nRavi",
                author: "Ravi",
                timestamp: "2024-05-21T19:30:10Z",
                uuid: "7afd255f-077a-5db7-8328-99da75c77266",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Dear Team,\n\nThank you all for your hard work and commitment. Looking forward to our meeting and celebrating our successes together!\n\nBest regards,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-22T09:15:00Z",
                uuid: "63d1c4ac-1111-5d92-a825-2247a710dc92",
                relevant: false,
              },
            ],
          },
          {
            conversation_id: 172,
            messages: [
              {
                conversation_id: 172,
                content:
                  "Dear Team,\n\nWe are excited to share the latest updates from Verba Chat. Our team has been working diligently to enhance user experience and efficiency. Stay tuned for more details on our upcoming features!\n\nBest regards,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-20T10:15:47Z",
                uuid: "929fb730-a9e8-509d-9f7c-08fc528dc66a",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hello Everyone,\n\nI just wanted to add that we are also rolling out new integrations with other services to make Verba Chat even more versatile. We appreciate your support and feedback as we implement these changes.\n\nKind regards,\nEdward",
                author: "Edward",
                timestamp: "2024-05-20T13:32:15Z",
                uuid: "c7516dd2-07f3-5715-aee5-5b02267a89ea",
                relevant: true,
              },
              {
                conversation_id: 172,
                content:
                  "Hi Team,\n\nJust a quick note to remind you about our upcoming webinar where we will showcase the new features of Verba Chat. It’s a great opportunity to see everything in action and ask questions.\n\nLooking forward to seeing you all there!\nRegards,\nRavi",
                author: "Ravi",
                timestamp: "2024-05-20T15:45:32Z",
                uuid: "67d8accd-51d0-52a8-ba34-544f308341a4",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Dear All,\n\nWe appreciate your enthusiasm for the upcoming features! We are also gathering feedback from early testers, and it has been overwhelmingly positive. Thank you for your continued engagement.\n\nBest,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-20T18:10:05Z",
                uuid: "cd5d1d5d-56f8-58ec-8349-d9460c4946b1",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hello Team,\n\nI wanted to remind everyone that the feedback deadline for the new features is approaching. Please ensure your comments are submitted by the end of the week to be considered in the final rollout.\n\nBest regards,\nEdward",
                author: "Edward",
                timestamp: "2024-05-21T09:20:16Z",
                uuid: "de47852a-2ea3-5dc4-9c7d-0c9baa71004e",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hi All,\n\nJust following up on Edward’s message. Your insights are invaluable to us, and we want to ensure we address all concerns before the final release. Thank you for your contributions!\n\nKind regards,\nRavi",
                author: "Ravi",
                timestamp: "2024-05-21T12:05:44Z",
                uuid: "82e61409-2877-530e-b6d0-b6f1eba0d65a",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Dear Team,\n\nI’m thrilled to report that the new features are on track for release next month! Thank you all for your hard work and dedication throughout this process.\n\nBest,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-21T14:35:22Z",
                uuid: "71a9e2f8-03f7-5b2d-a0d1-ae1bad796f6a",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hello Everyone,\n\nAs we approach the release date, I encourage everyone to finalize their testing and provide any last-minute feedback. Your efforts are crucial to our success!\n\nRegards,\nEdward",
                author: "Edward",
                timestamp: "2024-05-21T16:55:38Z",
                uuid: "cccc15b3-6423-5fb1-b218-ebc40de2d7cf",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Hi Team,\n\nWe are planning a celebratory meeting to discuss our successful launch and future directions. I hope everyone can join us!\n\nBest,\nRavi",
                author: "Ravi",
                timestamp: "2024-05-21T19:30:10Z",
                uuid: "7afd255f-077a-5db7-8328-99da75c77266",
                relevant: false,
              },
              {
                conversation_id: 172,
                content:
                  "Dear Team,\n\nThank you all for your hard work and commitment. Looking forward to our meeting and celebrating our successes together!\n\nBest regards,\nWu Zi-nan",
                author: "Wu Zi-nan",
                timestamp: "2024-05-22T09:15:00Z",
                uuid: "63d1c4ac-1111-5d92-a825-2247a710dc92",
                relevant: false,
              },
            ],
          },
        ],
        metadata: {
          collection_name: "Example_verba_email_chains",
          display_type: "conversation",
          needs_summarising: false,
          query_text: null,
          query_type: "filter_only",
          chunked: false,
          query_output: {
            target_collections: ["Example_verba_email_chains"],
            search_type: "filter_only",
            search_query: null,
            sort_by: {
              property_name: "message_timestamp",
              direction: "descending",
            },
            filter_buckets: [
              {
                filters: [
                  {
                    property_name: "message_author",
                    operator: "=",
                    value: "Edward",
                  },
                ],
                operator: "AND",
              },
            ],
            limit: 5,
          },
          code: {
            language: "python",
            title: "Query",
            text: "collection.query.fetch_objects(\n    filters=Filter.all_of([\n        Filter.by_property('message_author').equal('Edward')\n    ]),\n    limit=5,\n    sort=Sort.by_property(\n        'message_timestamp',\n        ascending=False\n    )\n)",
          },
        },
        code: {
          language: "python",
          title: "Query",
          text: "collection.query.fetch_objects(\n    filters=Filter.all_of([\n        Filter.by_property('message_author').equal('Edward')\n    ]),\n    limit=5,\n    sort=Sort.by_property(\n        'message_timestamp',\n        ascending=False\n    )\n)",
        },
      },
    },
    {
      type: "text",
      id: "tex-b02d1f0f-7dcc-4154-8d95-9df01ac10f8d",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "8d7a4c89-f6a1-4630-a310-80e64f2e528b",
      query_id: "93624d05-585a-4111-b9c5-fa14eceb628b",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'm now providing a summary of the latest conversations involving Edward.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-e6299419-812b-4e33-9a5c-d0d48599551d",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "8d7a4c89-f6a1-4630-a310-80e64f2e528b",
      query_id: "93624d05-585a-4111-b9c5-fa14eceb628b",
      payload: {
        type: "text_with_citations",
        metadata: {
          title: "Latest Conversations of Edward",
        },
        objects: [
          {
            text: "Edward's recent conversations include discussions about Weaviate disk usage, Verba connection issues, and installation problems on M1 Macs. He also contributed to discussions about Verba Chat updates and provided support to users.",
            ref_ids: [],
          },
          {
            text: "\n\nIn a Slack conversation from September 26, 2024, Edward discussed Weaviate disk usage with Zara and Kaladin, suggesting checking configuration settings and digging into logs to address a read-only state issue despite available space. ",
            ref_ids: [
              "query_Example_verba_slack_conversations_0_0",
              "query_Example_verba_slack_conversations_0_1",
            ],
          },
          {
            text: "\n\nOn August 1, 2024, Edward helped Xaden troubleshoot a Verba connection issue with Ollama and Weaviate by suggesting to verify the service status of Ollama. ",
            ref_ids: ["query_Example_verba_slack_conversations_0_2"],
          },
          {
            text: "\n\nOn June 27, 2024, Edward mentioned an AttributeError with InputText while installing Verba on M1 Macs and considered using a virtual environment and downgrading Python to resolve the issue. ",
            ref_ids: [
              "query_Example_verba_slack_conversations_0_3",
              "query_Example_verba_slack_conversations_0_4",
            ],
          },
          {
            text: "\n\nIn an email exchange from May 20-21, 2024, Edward contributed to updates about Verba Chat, reminding the team about the feedback deadline for new features and encouraging them to finalize testing. ",
            ref_ids: [
              "query_Example_verba_email_chains_0_3",
              "query_Example_verba_email_chains_0_4",
            ],
          },
          {
            text: "\n\nIn another email thread from May 21, 2024, Edward provided support to Xaden regarding the product's scalability and troubleshooting resources. ",
            ref_ids: ["query_Example_verba_email_chains_0_2"],
          },
          {
            text: "\n\nIn an email from September 23, 2024, Edward assisted Xaden with connecting the application to external APIs by advising to configure the settings in the .env file and ensure the API keys are correctly inserted and the endpoints are accessible.",
            ref_ids: ["query_Example_verba_email_chains_0_0"],
          },
          {
            text: "\n",
            ref_ids: [],
          },
        ],
      },
    },
    {
      type: "suggestion",
      id: "865ad5b6-37b1-496c-8912-2f1750da7f1a",
      conversation_id: "8d7a4c89-f6a1-4630-a310-80e64f2e528b",
      query_id: "93624d05-585a-4111-b9c5-fa14eceb628b",
      user_id: "com-827dda8e-1015-46ec-bd98-73c5a4de0b2d",
      payload: {
        error: "",
        suggestions: [],
      },
    },
  ],
};
