/* eslint-disable @typescript-eslint/no-explicit-any */
export const conversationResponse: any = {
  id: "12345",
  query: "What is Verba?",
  messages: [
    {
      type: "User",
      id: "1e15fdb3-2cc0-4e63-95d5-db626838aad2",
      query_id: "2238e46c-396c-4863-b46d-f319e5f56f8b",
      conversation_id: "ded92d5c-199c-451e-b8c0-49a372b084a0",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: [
          "Are there any email conversations about pdf ingestion in verba?",
        ],
      },
    },
    {
      type: "text",
      conversation_id: "ded92d5c-199c-451e-b8c0-49a372b084a0",
      query_id: "2238e46c-396c-4863-b46d-f319e5f56f8b",
      id: "tex-96d96d83-5b32-4d26-b000-e51ccc1cacf3",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: 'I am now searching the "example_verba_email_chains" collection for mentions of "pdf ingestion".',
          },
        ],
      },
    },
    {
      type: "text",
      conversation_id: "ded92d5c-199c-451e-b8c0-49a372b084a0",
      query_id: "2238e46c-396c-4863-b46d-f319e5f56f8b",
      id: "tex-6e160c11-94a1-45b1-8ff3-2669ec1131dd",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I've selected the 'query' function to directly search for relevant email conversations containing the keywords \"pdf ingestion.\"",
          },
        ],
      },
    },
    {
      type: "text",
      conversation_id: "ded92d5c-199c-451e-b8c0-49a372b084a0",
      query_id: "2238e46c-396c-4863-b46d-f319e5f56f8b",
      id: "tex-cfc42c47-451b-47a8-bd7c-79f50ad4a5be",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'm using a hybrid search to find the most relevant conversations about PDF ingestion in Verba, which will combine both semantic and keyword matching for better results.",
          },
        ],
      },
    },
    {
      type: "result",
      conversation_id: "ded92d5c-199c-451e-b8c0-49a372b084a0",
      query_id: "2238e46c-396c-4863-b46d-f319e5f56f8b",
      id: "res-6dd791f2-c9cd-4515-ace4-68fc76285bd2",
      payload: {
        type: "conversation",
        metadata: {
          collection_name: "example_verba_email_chains",
          return_type: "conversation",
          output_type: "original",
          query_text: "pdf ingestion",
          query_type: "hybrid",
          code: {
            language: "python",
            title: "Query",
            text: 'collection.query.hybrid(\n    query="pdf ingestion",\n    limit=5\n)',
          },
        },
        objects: [
          {
            messages: [
              {
                conversation_id: 394,
                content:
                  "Hello Team,\n\nWe are excited to announce a new update to our data ingestion tool! The latest version includes improved error handling and better schema management capabilities. Make sure to check out the new documentation for best practices on setting up your client.\n\nBest regards,\nKerrigan",
                author: "Kerrigan",
                timestamp: "2023-10-10 09:15:00",
                message_id: 0,
                uuid: "6c648d0564dc5bddbdb741aa2af054a8",
                relevant: false,
              },
              {
                conversation_id: 394,
                content:
                  "Hi Everyone,\n\nI wanted to share some tips on optimizing your data ingestion process. Remember to validate your files before loading them into the system to avoid potential hiccups. Our updated guide covers these points in detail!\n\nKind regards,\nDanny",
                author: "Danny",
                timestamp: "2023-10-10 10:45:32",
                message_id: 1,
                uuid: "4c802cac4c8c5480aecbe28e34a6c154",
                relevant: true,
              },
              {
                conversation_id: 394,
                content:
                  "Dear Users,\n\nHave you explored our new features yet? The recent release also allows for batch processing of files, greatly enhancing efficiency. Don't miss out on utilizing these capabilities in your workflows.\n\nRegards,\nRavi",
                author: "Ravi",
                timestamp: "2023-10-10 12:30:47",
                message_id: 2,
                uuid: "38bb6391c816518f98f010bb57d05e1e",
                relevant: false,
              },
              {
                conversation_id: 394,
                content:
                  "Hello All,\n\nJust a friendly reminder to regularly check for updates. Our team is constantly working to enhance the tool and your feedback is invaluable in this process. Let us know how we can assist you further!\n\nBest,\nKerrigan",
                author: "Kerrigan",
                timestamp: "2023-10-10 14:05:12",
                message_id: 3,
                uuid: "de2d66df777550fdb79cec7697ad6bd7",
                relevant: false,
              },
              {
                conversation_id: 394,
                content:
                  "Hi Team,\n\nAs we continue to enhance our data processing tool, we encourage you to share your experiences and suggestions. Collaboration is key to our success!\n\nKind regards,\nDanny",
                author: "Danny",
                timestamp: "2023-10-10 15:30:25",
                message_id: 4,
                uuid: "619e95978cc6531f9c3150f1e8f20a62",
                relevant: false,
              },
              {
                conversation_id: 394,
                content:
                  "Dear Team,\n\nWe appreciate your continued support! Stay tuned for our upcoming webinar where we will dive deeper into the new features and answer any questions you may have. Looking forward to seeing you there!\n\nWarm regards,\nRavi",
                author: "Ravi",
                timestamp: "2023-10-10 16:45:58",
                message_id: 5,
                uuid: "d477eb70acee50e4a7af8b2ee0636abc",
                relevant: false,
              },
            ],
            conversation_id: 394,
          },
          {
            messages: [
              {
                conversation_id: 367,
                content:
                  "Hello Support Team,\n\nI hope this message finds you well. I recently started using your PDFReader feature and had a couple of questions regarding its functionalities. Could you please clarify if there are any limitations on the file size for the PDFs I can upload?\n\nThank you for your assistance!\n\nBest regards,\nKaladin",
                author: "Kaladin",
                timestamp: "2023-10-01 09:15:23",
                message_id: 0,
                uuid: "172e0ca06d8f50f1b99ac23834656213",
                relevant: false,
              },
              {
                conversation_id: 367,
                content:
                  "Dear Kaladin,\n\nThank you for reaching out to us! I'm glad to hear that you are using the PDFReader feature. There are no strict limitations on the file size, but we recommend keeping it under 100MB for optimal performance. If you encounter any issues with larger files, feel free to let us know.\n\nBest,\nDalinar",
                author: "Dalinar",
                timestamp: "2023-10-01 09:40:56",
                message_id: 1,
                uuid: "d5678a488b4b5d39a01e3e496610f107",
                relevant: false,
              },
              {
                conversation_id: 367,
                content:
                  "Hi Dalinar,\n\nThank you for the quick response! That makes sense. I also wanted to ask if there are any specific formats or types of PDFs that the PDFReader struggles with?\n\nLooking forward to your reply.\n\nRegards,\nKaladin",
                author: "Kaladin",
                timestamp: "2023-10-01 10:02:14",
                message_id: 2,
                uuid: "2c622bda4814500d8ad69d75c4d2f459",
                relevant: false,
              },
              {
                conversation_id: 367,
                content:
                  "Hello Kaladin,\n\nI appreciate your questions. The PDFReader is designed to handle most standard PDF formats without issues. However, very complex PDFs with heavy graphics or unusual encodings might occasionally lead to performance hiccups. If you experience any such issues, please let us know, and we can help troubleshoot!\n\nKind regards,\nRavi",
                author: "Ravi",
                timestamp: "2023-10-01 10:30:42",
                message_id: 3,
                uuid: "ccb78b4a8e1656c99c815a0a6aa139ba",
                relevant: true,
              },
              {
                conversation_id: 367,
                content:
                  "Dear Ravi,\n\nThanks for the information! That’s helpful to know. I also noticed a feature that allows for chunking the PDF content. Can you explain how that works, and if there are any settings I should be aware of?\n\nBest wishes,\nKaladin",
                author: "Kaladin",
                timestamp: "2023-10-01 11:05:11",
                message_id: 4,
                uuid: "f388a36d325758b7ba9b903ee1a4d1a9",
                relevant: false,
              },
              {
                conversation_id: 367,
                content:
                  "Hi Kaladin,\n\nGreat question! The TokenChunker feature automatically breaks down the text into manageable chunks for processing. You don’t need to adjust any settings; it works seamlessly in the background. But if you want to modify how the chunking is done, we can provide customization options upon request.\n\nRegards,\nDalinar",
                author: "Dalinar",
                timestamp: "2023-10-01 12:00:29",
                message_id: 5,
                uuid: "94cdca4f66e05f31a5cd40c49430fd2a",
                relevant: false,
              },
              {
                conversation_id: 367,
                content:
                  "Hello Dalinar,\n\nThank you for the clarification! I appreciate the support. Lastly, are there any upcoming features or updates planned for the PDFReader that I should know about?\n\nThanks again!\nKaladin",
                author: "Kaladin",
                timestamp: "2023-10-01 13:15:48",
                message_id: 6,
                uuid: "f92e6bc9f62a52428319a76836808b96",
                relevant: false,
              },
              {
                conversation_id: 367,
                content:
                  "Dear Kaladin,\n\nWe’re glad to hear that you're enjoying the PDFReader! We have a few enhancements in the pipeline, including improved error handling and additional format support, which we hope to roll out soon. Stay tuned for updates!\n\nBest regards,\nRavi",
                author: "Ravi",
                timestamp: "2023-10-01 14:30:05",
                message_id: 7,
                uuid: "c524f1564c93563b9a8ab8aa7dadd78b",
                relevant: false,
              },
              {
                conversation_id: 367,
                content:
                  "Hi Ravi,\n\nThat sounds fantastic! I look forward to those updates. Thank you for all the help and information you've provided. It has really enhanced my experience with your product.\n\nWarm regards,\nKaladin",
                author: "Kaladin",
                timestamp: "2023-10-01 15:45:12",
                message_id: 8,
                uuid: "2b23c6f40ffa5241939eb6b5e8b3d709",
                relevant: false,
              },
            ],
            conversation_id: 367,
          },
          {
            messages: [
              {
                conversation_id: 413,
                content:
                  "Hi Support Team,\n\nI hope this message finds you well. I have been using your product for a while now, and I wanted to inquire about the data import features. Is there a way to streamline the process for importing large datasets? \n\nThank you for your assistance!\n\nBest regards,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 09:15:32",
                message_id: 0,
                uuid: "0ad9401803e85291b4526ae5452c0891",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hello Jaina,\n\nThank you for reaching out! We appreciate your feedback. Currently, our product allows for batch imports, but we understand the need for more flexibility. We are working on features to allow for more efficient imports, including incremental data ingestion.\n\nIf you have any specific requirements or suggestions, please feel free to share!\n\nKind regards,\nFatima",
                author: "Fatima",
                timestamp: "2023-10-01 09:49:02",
                message_id: 1,
                uuid: "a2344a6e16e85c3da6fff4330e1ec4cd",
                relevant: true,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Fatima,\n\nThank you for your prompt response! Incremental ingestion sounds like a great improvement. Could you provide an estimated timeline for when this feature might be available? It would help me plan my data workflows better.\n\nLooking forward to your reply.\n\nBest,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 10:05:18",
                message_id: 2,
                uuid: "8140732c8a3650eb9042685b1b5d0d59",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Dear Jaina,\n\nThank you for your interest in our upcoming features! While I can't provide an exact timeline just yet, I can confirm that our development team is actively working on this enhancement. We aim to make it available in the next few months. I'll be sure to keep you updated on our progress.\n\nBest wishes,\nZara",
                author: "Zara",
                timestamp: "2023-10-01 11:14:47",
                message_id: 3,
                uuid: "be64756a59045bee9dda114bf9352609",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hello Zara,\n\nI appreciate the update! I understand that these developments take time. In the meantime, are there any workarounds you could suggest for optimizing my current data import processes? \n\nThank you for your help!\n\nWarm regards,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 12:30:21",
                message_id: 4,
                uuid: "292b71fac1ec5bbc80820959ce97af8a",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Jaina,\n\nGreat question! One workaround could be to segment your data into smaller batches. This way, you can manage imports more efficiently while we finalize the incremental ingestion feature. Additionally, consider using our API for more control over the import process.\n\nLet me know if you need further assistance!\n\nBest,\nFatima",
                author: "Fatima",
                timestamp: "2023-10-01 13:45:33",
                message_id: 5,
                uuid: "c2c0911863725980a869812ac558044d",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Fatima,\n\nThank you for the suggestions! I'll start implementing those changes right away. It's reassuring to know that the incremental ingestion feature is on the way. \n\nIs there a way to receive notifications on updates regarding this feature?\n\nThanks again!\n\nBest,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 14:02:55",
                message_id: 6,
                uuid: "1862a3220bf0513f9c261594c99c2d1e",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hello Jaina,\n\nYes, absolutely! We can add you to our mailing list for feature updates. You will receive notifications as soon as we have news regarding the incremental ingestion feature or any other relevant updates.\n\nBest regards,\nZara",
                author: "Zara",
                timestamp: "2023-10-01 14:30:12",
                message_id: 7,
                uuid: "c36117796b815fc6b95a14014b8c1cf1",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Zara,\n\nThank you for adding me to the list! I’m looking forward to the updates. Your support has been fantastic, and I appreciate your team's responsiveness. \n\nHave a great day!\n\nWarmest regards,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 15:15:44",
                message_id: 8,
                uuid: "0f85f72bde0f55a4b062f882fa079f5c",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Jaina,\n\nThank you for your kind words! We're here to help, and we value your input. If you have any more questions or feedback, please don't hesitate to reach out. \n\nWishing you a productive day ahead!\n\nKind regards,\nFatima",
                author: "Fatima",
                timestamp: "2023-10-01 16:00:19",
                message_id: 9,
                uuid: "37ec61396db95b71b60ecfc81cfe45a8",
                relevant: false,
              },
            ],
            conversation_id: 413,
          },
          {
            messages: [
              {
                conversation_id: 263,
                content:
                  "Dear Support Team,\n\nI hope this message finds you well. I am currently exploring the features of your product and have some questions regarding its capabilities. Specifically, I would like to know if there are any limitations on file sizes for imports. I recently attempted to import a large PDF and encountered some difficulties. \n\nLooking forward to your guidance.\n\nBest regards,\nJohn",
                author: "John",
                timestamp: "2023-10-03 09:15:30",
                message_id: 0,
                uuid: "b75db827654f550ab914b1e3b5a51253",
                relevant: false,
              },
              {
                conversation_id: 263,
                content:
                  "Hello John,\n\nThank you for reaching out! We appreciate your interest in our product. Regarding your question, there are indeed some size limitations based on the method of import. However, I would be more than happy to assist you in troubleshooting the issue you faced. Could you please provide more details about the file and the method you used?\n\nKind regards,\nFatima",
                author: "Fatima",
                timestamp: "2023-10-03 10:35:45",
                message_id: 1,
                uuid: "7d0f510fd8c45d5f8091b17abd5639b0",
                relevant: false,
              },
              {
                conversation_id: 263,
                content:
                  "Hi Fatima,\n\nThank you for your prompt response. The PDF file I was trying to import is approximately 7.7MB. I used the Token Chunker feature with settings optimized for larger files. Despite following the setup instructions, I encountered a chunk mismatch error. Any suggestions on how to proceed?\n\nThanks again!\n\nBest,\nJohn",
                author: "John",
                timestamp: "2023-10-03 11:50:12",
                message_id: 2,
                uuid: "9c0f2fb8c18f5873b7a3555c45cec8b5",
                relevant: true,
              },
              {
                conversation_id: 263,
                content:
                  "Dear John,\n\nThank you for the additional information. We recommend checking the specific settings for your chunking parameters. Sometimes, adjusting the overlap can yield better results. Additionally, our team is working on enhancing the import capabilities in upcoming updates, which should address such issues more effectively. \n\nPlease let us know if this helps or if you need further assistance.\n\nRegards,\nDanny",
                author: "Danny",
                timestamp: "2023-10-03 13:20:56",
                message_id: 3,
                uuid: "451574de3b5d50f0b4d31d46b7748c4e",
                relevant: false,
              },
              {
                conversation_id: 263,
                content:
                  "Hi Danny,\n\nI appreciate your suggestions and will try adjusting the overlap settings. I’m also interested to hear more about the upcoming updates you mentioned. Are there any specific features we should be looking forward to that might improve our experience with file imports?\n\nThank you!\n\nSincerely,\nJohn",
                author: "John",
                timestamp: "2023-10-03 15:05:24",
                message_id: 4,
                uuid: "b4805b10f2275b3bb80b143344789b8a",
                relevant: false,
              },
              {
                conversation_id: 263,
                content:
                  "Hello John,\n\nGreat to hear you’re willing to try the adjustments! Regarding the updates, we are planning to enhance not only the import capabilities but also the overall performance and user interface. We will definitely keep you informed as we roll out new features. \n\nStay tuned!\n\nBest,\nFatima",
                author: "Fatima",
                timestamp: "2023-10-03 16:45:37",
                message_id: 5,
                uuid: "db9c4548a0fc5db592975a576ba49d05",
                relevant: false,
              },
              {
                conversation_id: 263,
                content:
                  "Hi Fatima,\n\nThat sounds exciting! I look forward to trying out the new features once they are released. In the meantime, if I encounter any more issues, I will reach out for assistance. Thank you for your support!\n\nBest regards,\nJohn",
                author: "John",
                timestamp: "2023-10-03 18:15:00",
                message_id: 6,
                uuid: "8cd0ab58e296510b871371fb972d2097",
                relevant: false,
              },
              {
                conversation_id: 263,
                content:
                  "Dear John,\n\nWe’re here to help anytime! Don’t hesitate to reach out with any further questions or feedback. Your experience is very important to us, and we value your insights.\n\nHave a wonderful day!\n\nKind regards,\nDanny",
                author: "Danny",
                timestamp: "2023-10-03 19:30:10",
                message_id: 7,
                uuid: "1305cce96971551aad8cd6499776cd8e",
                relevant: false,
              },
              {
                conversation_id: 263,
                content:
                  "Hello John,\n\nJust a quick note to say that we are always eager to hear your thoughts. Your feedback is crucial as we continue to improve our services. Thank you for being a valued customer!\n\nWarm regards,\nFatima",
                author: "Fatima",
                timestamp: "2023-10-03 21:00:45",
                message_id: 8,
                uuid: "f817b7c41f73552dadd35476b2a36c4f",
                relevant: false,
              },
            ],
            conversation_id: 263,
          },
          {
            messages: [
              {
                conversation_id: 413,
                content:
                  "Hi Support Team,\n\nI hope this message finds you well. I have been using your product for a while now, and I wanted to inquire about the data import features. Is there a way to streamline the process for importing large datasets? \n\nThank you for your assistance!\n\nBest regards,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 09:15:32",
                message_id: 0,
                uuid: "0ad9401803e85291b4526ae5452c0891",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hello Jaina,\n\nThank you for reaching out! We appreciate your feedback. Currently, our product allows for batch imports, but we understand the need for more flexibility. We are working on features to allow for more efficient imports, including incremental data ingestion.\n\nIf you have any specific requirements or suggestions, please feel free to share!\n\nKind regards,\nFatima",
                author: "Fatima",
                timestamp: "2023-10-01 09:49:02",
                message_id: 1,
                uuid: "a2344a6e16e85c3da6fff4330e1ec4cd",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Fatima,\n\nThank you for your prompt response! Incremental ingestion sounds like a great improvement. Could you provide an estimated timeline for when this feature might be available? It would help me plan my data workflows better.\n\nLooking forward to your reply.\n\nBest,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 10:05:18",
                message_id: 2,
                uuid: "8140732c8a3650eb9042685b1b5d0d59",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Dear Jaina,\n\nThank you for your interest in our upcoming features! While I can't provide an exact timeline just yet, I can confirm that our development team is actively working on this enhancement. We aim to make it available in the next few months. I'll be sure to keep you updated on our progress.\n\nBest wishes,\nZara",
                author: "Zara",
                timestamp: "2023-10-01 11:14:47",
                message_id: 3,
                uuid: "be64756a59045bee9dda114bf9352609",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hello Zara,\n\nI appreciate the update! I understand that these developments take time. In the meantime, are there any workarounds you could suggest for optimizing my current data import processes? \n\nThank you for your help!\n\nWarm regards,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 12:30:21",
                message_id: 4,
                uuid: "292b71fac1ec5bbc80820959ce97af8a",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Jaina,\n\nGreat question! One workaround could be to segment your data into smaller batches. This way, you can manage imports more efficiently while we finalize the incremental ingestion feature. Additionally, consider using our API for more control over the import process.\n\nLet me know if you need further assistance!\n\nBest,\nFatima",
                author: "Fatima",
                timestamp: "2023-10-01 13:45:33",
                message_id: 5,
                uuid: "c2c0911863725980a869812ac558044d",
                relevant: true,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Fatima,\n\nThank you for the suggestions! I'll start implementing those changes right away. It's reassuring to know that the incremental ingestion feature is on the way. \n\nIs there a way to receive notifications on updates regarding this feature?\n\nThanks again!\n\nBest,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 14:02:55",
                message_id: 6,
                uuid: "1862a3220bf0513f9c261594c99c2d1e",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hello Jaina,\n\nYes, absolutely! We can add you to our mailing list for feature updates. You will receive notifications as soon as we have news regarding the incremental ingestion feature or any other relevant updates.\n\nBest regards,\nZara",
                author: "Zara",
                timestamp: "2023-10-01 14:30:12",
                message_id: 7,
                uuid: "c36117796b815fc6b95a14014b8c1cf1",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Zara,\n\nThank you for adding me to the list! I’m looking forward to the updates. Your support has been fantastic, and I appreciate your team's responsiveness. \n\nHave a great day!\n\nWarmest regards,\nJaina",
                author: "Jaina",
                timestamp: "2023-10-01 15:15:44",
                message_id: 8,
                uuid: "0f85f72bde0f55a4b062f882fa079f5c",
                relevant: false,
              },
              {
                conversation_id: 413,
                content:
                  "Hi Jaina,\n\nThank you for your kind words! We're here to help, and we value your input. If you have any more questions or feedback, please don't hesitate to reach out. \n\nWishing you a productive day ahead!\n\nKind regards,\nFatima",
                author: "Fatima",
                timestamp: "2023-10-01 16:00:19",
                message_id: 9,
                uuid: "37ec61396db95b71b60ecfc81cfe45a8",
                relevant: false,
              },
            ],
            conversation_id: 413,
          },
        ],
        code: {
          language: "python",
          title: "Query",
          text: 'collection.query.hybrid(\n    query="pdf ingestion",\n    limit=5\n)',
        },
      },
    },
    {
      type: "text",
      conversation_id: "ded92d5c-199c-451e-b8c0-49a372b084a0",
      query_id: "2238e46c-396c-4863-b46d-f319e5f56f8b",
      id: "tex-de989adf-031c-430c-9bbd-db975f69d9bc",
      payload: {
        type: "summary",
        metadata: {},
        objects: [
          {
            text: 'I\'ve reviewed several email conversations related to PDF ingestion within Verba.  Some conversations discuss general data ingestion updates and improvements, but others directly address user questions and issues concerning PDF handling.  One user reported a "chunk mismatch error" when importing a large PDF using the TokenChunker feature.  Support staff suggested checking the chunking parameters, specifically the overlap settings, as a potential solution.  Additionally, ongoing development efforts are focused on improving import capabilities and addressing similar issues in future updates.',
            title: "Relevant Verba Email Conversations Regarding PDF Ingestion",
          },
        ],
      },
    },
  ],
  finished: false,
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
