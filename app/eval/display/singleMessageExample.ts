export const singleMessageResponse: any = {
    id: "12345",
    query: "Are there any messages in Slack about Verba?",
    messages: [
        {
            "type": "User",
            "id": "b9c22da2-941e-4de4-9ba5-f1bc13817562",
            "query_id": "c7036103-a072-42fb-8f3c-57a8bf83db98",
            "conversation_id": "fbae3b14-c2f3-424d-9dde-12403edccc70",
            "user_id": "051ae4aa-1841-5419-81e0-bbe2784f6632",
            "payload": {
                "type": "text",
                "metadata": {},
                "code": {
                    "language": "",
                    "title": "",
                    "text": ""
                },
                "objects": [
                    "Are there any messages in Slack about Verba?"
                ]
            }
        },
        {
            "type": "text",
            "user_id": "051ae4aa-1841-5419-81e0-bbe2784f6632",
            "conversation_id": "fbae3b14-c2f3-424d-9dde-12403edccc70",
            "query_id": "c7036103-a072-42fb-8f3c-57a8bf83db98",
            "payload": {
                "type": "response",
                "metadata": {},
                "objects": [
                    {
                        "text": "I will now search the Slack conversations for any messages related to Verba."
                    }
                ]
            }
        },
        {
            "type": "text",
            "user_id": "051ae4aa-1841-5419-81e0-bbe2784f6632",
            "conversation_id": "fbae3b14-c2f3-424d-9dde-12403edccc70",
            "query_id": "c7036103-a072-42fb-8f3c-57a8bf83db98",
            "payload": {
                "type": "response",
                "metadata": {},
                "objects": [
                    {
                        "text": "I'm performing a keyword search for \"Verba\" within the Slack conversation messages."
                    }
                ]
            }
        },
        {
            "type": "result",
            "user_id": "051ae4aa-1841-5419-81e0-bbe2784f6632",
            "conversation_id": "fbae3b14-c2f3-424d-9dde-12403edccc70",
            "query_id": "c7036103-a072-42fb-8f3c-57a8bf83db98",
            "id": "res-cfd10411-0ec2-42d4-aed1-bc94799f8b08",
            "payload": {
                "type": "message",
                "objects": [
                    {
                        "conversation_id": 250,
                        "content": "Hey team, I just set up a separate repo for the Verba Docker image. Has anyone thought about the need for an official image from Verba?",
                        "author": "John",
                        "timestamp": "2023-10-01T10:15:23Z",
                        "uuid": "f9723964-e1b7-59f3-abdc-b1bdb7e0464f",
                        "relevant": false
                    },
                    {
                        "conversation_id": 447,
                        "content": "That’s a good idea! I wonder if the VERBA_URL and VERBA_API_KEY not being set is contributing to this problem.",
                        "author": "John",
                        "timestamp": "2023-10-02T09:07:45Z",
                        "uuid": "2c295753-63f1-5d38-a211-ad45a91cdb40",
                        "relevant": false
                    },
                    {
                        "conversation_id": 446,
                        "content": "I had this happen too! It might be related to environment variables not being set properly. Are you using VERBA_URL and VERBA_API_KEY?",
                        "author": "Jaina",
                        "timestamp": "2023-09-08T10:05:30Z",
                        "uuid": "73aab885-092c-517c-841e-8881d1eadc6d",
                        "relevant": false
                    },
                    {
                        "conversation_id": 256,
                        "content": "Hey team, has anyone encountered the WebSocket error when using Verba with vLLM?",
                        "author": "Dalinar",
                        "timestamp": "2023-10-08T10:05:32Z",
                        "uuid": "d92ab649-c307-55e6-9de9-8be287a18c74",
                        "relevant": false
                    },
                    {
                        "conversation_id": 432,
                        "content": "Hey team! Just wanted to say I love the new features in Verba! 🎉",
                        "author": "Sofia",
                        "timestamp": "2023-10-12T09:00:00Z",
                        "uuid": "badef527-7a86-5ea0-9a21-9f5eb483dc9d",
                        "relevant": false
                    }
                ],
                "metadata": {
                    "collection_name": "Example_verba_slack_conversations",
                    "display_type": "message",
                    "summarise_items": false,
                    "query_text": "Verba",
                    "query_type": "keyword",
                    "chunked": false,
                    "query_output": {
                        "target_collections": [
                            "Example_verba_slack_conversations"
                        ],
                        "search_type": "keyword",
                        "search_query": "Verba",
                        "sort_by": null,
                        "filter_buckets": null,
                        "limit": 5
                    },
                    "code": {
                        "language": "python",
                        "title": "Query",
                        "text": "collection.query.bm25(\n    query='Verba',\n    limit=5\n)"
                    }
                },
                "code": {
                    "language": "python",
                    "title": "Query",
                    "text": "collection.query.bm25(\n    query='Verba',\n    limit=5\n)"
                }
            }
        },
        {
            "type": "text",
            "user_id": "051ae4aa-1841-5419-81e0-bbe2784f6632",
            "conversation_id": "fbae3b14-c2f3-424d-9dde-12403edccc70",
            "query_id": "c7036103-a072-42fb-8f3c-57a8bf83db98",
            "payload": {
                "type": "response",
                "metadata": {},
                "objects": [
                    {
                        "text": "I will now summarize the messages I found for you."
                    }
                ]
            }
        },
        {
            "type": "text",
            "user_id": "051ae4aa-1841-5419-81e0-bbe2784f6632",
            "conversation_id": "fbae3b14-c2f3-424d-9dde-12403edccc70",
            "query_id": "c7036103-a072-42fb-8f3c-57a8bf83db98",
            "payload": {
                "type": "summary",
                "metadata": {},
                "objects": [
                    {
                        "text": "Yes, there are several messages in Slack about Verba.\nJohn mentioned setting up a separate repo for the Verba Docker image and inquired about the need for an official image from Verba.\nJaina and John discussed a potential issue related to environment variables (VERBA_URL and VERBA_API_KEY) not being set properly, which might be causing a WebSocket error.\nDalinar asked if anyone had encountered a WebSocket error when using Verba with vLLM.\nSofia expressed their appreciation for the new features in Verba.",
                        "title": "Slack messages about Verba"
                    }
                ]
            }
        }
    ]

}