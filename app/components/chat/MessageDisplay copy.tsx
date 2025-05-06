// "use client";

// import React, { useContext, useEffect, useState } from "react";

// import {
//   ConversationMessage,
//   Message,
//   ResponsePayload,
//   SummaryPayload,
//   ResultPayload,
//   TextPayload,
//   AggregationPayload,
//   NERResponse,
//   ConversationDisplayType,
//   MergedDocumentPayload,
//   CodeMetadata,
//   MergedConversationPayload,
//   RateLimitPayload,
//   SuggestionPayload,
// } from "../types";
// import { DocumentPayload, Product } from "@/app/types/displays";

// import UserMessageDisplay from "./display/User";
// import ErrorMessageDisplay from "./display/Error";
// import TextDisplay from "./display/Text";
// import TicketsDisplay from "./display/Tickets";
// import WarningDisplay from "./display/Warning";
// import SummaryDisplay from "./display/Summary";
// import BoringGenericDisplay from "./display/BoringGeneric";
// import CodeDisplay from "./display/Code";
// import AggregationDisplay from "./display/Aggregation";
// import DocumentDisplay from "./display/DocumentDisplay";
// import ResponseButtons from "./display/ResponseButtons";
// import InfoMessageDisplay from "./display/Info";
// import { Skeleton } from "@/components/ui/skeleton";
// import ConversationsDisplay from "./display/Conversations";
// import ConversationMessageDisplay from "./display/ConversationMessage";
// import { SocketContext } from "../contexts/SocketContext";
// import RateLimitMessageDisplay from "./display/RateLimit";
// import SuggestionDisplay from "./display/Suggestion";
// import ProductDisplay from "./display/ProductDisplay";

// interface MessageDisplayProps {
//   messages: Message[];
//   _collapsed: boolean;
//   conversationID: string;
//   queryID: string;
//   messagesEndRef: React.RefObject<HTMLDivElement>;
//   finished: boolean;
//   query_start: Date;
//   query_end: Date | null;
//   NER: NERResponse | null;
//   updateNER: (
//     conversationId: string,
//     queryId: string,
//     NER: NERResponse
//   ) => void;
//   feedback: number | null;
//   updateFeedback: (
//     conversationId: string,
//     queryId: string,
//     feedback: number
//   ) => void;
//   addDisplacement: (value: number) => void;
//   addDistortion: (value: number) => void;
//   handleSendQuery: (query: string, route?: string, mimick?: boolean) => void;
//   isLastQuery: boolean;
// }

// const MessageDisplay: React.FC<MessageDisplayProps> = ({
//   messages,
//   _collapsed,
//   messagesEndRef,
//   conversationID,
//   queryID,
//   finished,
//   query_start,
//   query_end,
//   NER,
//   updateNER,
//   feedback,
//   updateFeedback,
//   addDisplacement,
//   addDistortion,
//   handleSendQuery,
//   isLastQuery,
// }) => {
//   const [displayMessages, setDisplayMessages] = useState<Message[]>([]);

//   const [collapsed, setCollapsed] = useState<boolean>(_collapsed);

//   const { socketOnline } = useContext(SocketContext);

//   const filterMessages = (_messages: Message[]) => {
//     return _messages.filter((message) => message.type !== "training_update");
//   };

//   // merging dopcument displays 
//   const mergeDocumentMessages = (_messages: Message[]) => {
//     const newMessages: Message[] = [];
//     const skip_indices = new Set<number>();

//     _messages.forEach((message, index) => {
//       if (skip_indices.has(index)) {
//         return;
//       }

//       if (
//         message.type === "result" &&
//         (message.payload as ResultPayload).type === "document"
//       ) {
//         const merged_documents: MergedDocumentPayload = {
//           type: "merged_document",
//           code_metadata: [],
//           objects: [],
//         };

//         for (let i = index; i < _messages.length; i++) {
//           if (skip_indices.has(i)) continue;

//           const nextMessage = _messages[i];
//           if (
//             nextMessage.type === "result" &&
//             (nextMessage.payload as ResultPayload).type === "document"
//           ) {
//             const code_metadata: CodeMetadata = {
//               metadata: {
//                 collection_name: (nextMessage.payload as ResultPayload)
//                   .metadata["collection_name"],
//                 total_objects: (nextMessage.payload as ResultPayload).objects
//                   .length,
//               },
//               code: (nextMessage.payload as ResultPayload).code,
//             };
//             merged_documents.code_metadata.push(code_metadata);
//             merged_documents.objects.push(
//               ...((nextMessage.payload as ResultPayload)
//                 .objects as DocumentPayload[])
//             );
//             skip_indices.add(i);
//           }
//         }

//         newMessages.push({
//           ...message,
//           type: "merged_result",
//           payload: merged_documents,
//           id: message.id,
//         });
//       } else {
//         newMessages.push(message);
//       }
//     });

//     return newMessages;
//   };

//   const mergeConversationMessages = (_messages: Message[]) => {
//     const newMessages: Message[] = [];
//     const skip_indices = new Set<number>();

//     _messages.forEach((message, index) => {
//       if (skip_indices.has(index)) {
//         return;
//       }

//       if (
//         message.type === "result" &&
//         (message.payload as ResultPayload).type === "conversation"
//       ) {
//         const merged_conversations: MergedConversationPayload = {
//           type: "merged_conversation",
//           code_metadata: [],
//           objects: [],
//         };

//         for (let i = index; i < _messages.length; i++) {
//           if (skip_indices.has(i)) continue;

//           const nextMessage = _messages[i];
//           if (
//             nextMessage.type === "result" &&
//             (nextMessage.payload as ResultPayload).type === "conversation"
//           ) {
//             const code_metadata: CodeMetadata = {
//               metadata: {
//                 collection_name: (nextMessage.payload as ResultPayload)
//                   .metadata["collection_name"],
//                 total_objects: (nextMessage.payload as ResultPayload).objects
//                   .length,
//               },
//               code: (nextMessage.payload as ResultPayload).code,
//             };
//             merged_conversations.code_metadata.push(code_metadata);
//             merged_conversations.objects.push(
//               ...((nextMessage.payload as ResultPayload)
//                 .objects as ConversationDisplayType[])
//             );
//             skip_indices.add(i);
//           }
//         }

//         newMessages.push({
//           ...message,
//           type: "merged_result",
//           payload: merged_conversations,
//           id: message.id,
//         });
//       } else {
//         newMessages.push(message);
//       }
//     });

//     return newMessages;
//   };

//   // naming for text vs conversation stuff needs to be adjusted
//   const mergeTextMessages = (_messages: Message[]) => {
//     const newMessages: Message[] = [];
//     const skip_indices: number[] = [];

//     _messages.forEach((message, index) => {
//       // Skipping logic
//       if (skip_indices.includes(index)) {
//         return;
//       } else if (
//         message.type === "text" &&
//         (message.payload as ResponsePayload).type === "response" &&
//         !(index + 1 == _messages.length)
//       ) {
//         const content: TextPayload[] = [
//           (message.payload as ResponsePayload).objects[0] as TextPayload,
//         ];
//         const next_message_id: string = message.id;

//         for (let i = index + 1; i < _messages.length; i++) {
//           if (
//             _messages[i].type === "text" &&
//             (_messages[i].payload as ResponsePayload).type === "response"
//           ) {
//             content.push(
//               (_messages[i].payload as ResponsePayload)
//                 .objects[0] as TextPayload
//             );
//             skip_indices.push(i);
//           } else {
//             break;
//           }
//         }

//         const newResponsePayload: ResponsePayload = {
//           type: "response",
//           metadata: (message.payload as ResponsePayload).metadata,
//           objects: content,
//         };

//         const newMessage: Message = {
//           ...message,
//           payload: newResponsePayload,
//           id: next_message_id,
//         };

//         newMessages.push(newMessage);
//       } else {
//         newMessages.push(message);
//       }
//     });

//     return newMessages;
//   };

//   // update variable names to PROPER FORMAT
//   useEffect(() => {
//     const filtered_messages = filterMessages(messages);
//     const merged_documents = mergeDocumentMessages(filtered_messages);
//     const merged_conversations = mergeConversationMessages(merged_documents);
//     const merged_messages = mergeTextMessages(merged_conversations);
//     setDisplayMessages(merged_messages);
//     addDisplacement(0.1);
//     addDistortion(0.08);
//     if (process.env.NODE_ENV === "development") {
//       console.log(messages);
//     }
//   }, [messages]);

//   return (
//     <div
//       className={`flex justify-start items-start w-full p-4 transition-all  duration-300`}
//     >
//       <div className="flex flex-col gap-4 w-full relative z-10 rounded-lg">
//         {displayMessages
//           .filter((m) => m.type === "User")
//           .map((message, index) => (
//             <div key={`${index}-${message.id}-message`} className="w-full flex">
//               {message.type === "User" && (
//                 <UserMessageDisplay
//                   NER={NER}
//                   updateNER={updateNER}
//                   conversationId={conversationID}
//                   queryId={queryID}
//                   onClick={() => setCollapsed((prev) => !prev)}
//                   key={`${index}-${message.id}-user`}
//                   payload={
//                     (message.payload as ResultPayload).objects as string[]
//                   }
//                   collapsed={collapsed}
//                 />
//               )}
//             </div>
//           ))}
//         {!collapsed &&
//           displayMessages.length < 2 &&
//           socketOnline &&
//           !finished && (
//             <div className="w-full flex-col flex gap-2 justify-start items-start fade-in">
//               <Skeleton className="w-full h-[1rem]" />
//               <Skeleton className="w-1/2 h-[1rem]" />
//               <Skeleton className="w-2/5 h-[1rem]" />
//               <Skeleton className="w-2/5 h-[1rem]" />
//             </div>
//           )}
//         {!collapsed && (
//           <div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-5">
//               {displayMessages
//                 .filter((m) => m.type !== "User" && m.type !== "suggestion")
//                 .map((message, index) => (
//                   <div
//                     key={`${index}-${message.id}-message`}
//                     className="w-full flex"
//                   >
//                     {message.type === "result" && (
//                       <div className="w-full flex flex-col justify-start items-start gap-3">
//                         <div className="flex">
//                           {(message.payload as ResultPayload).code && (
//                             <CodeDisplay
//                               payload={(message.payload as ResultPayload).code}
//                               metadata={{
//                                 collection_name: (
//                                   message.payload as ResultPayload
//                                 ).metadata["collection_name"],
//                                 total_objects: (
//                                   message.payload as ResultPayload
//                                 ).objects.length,
//                               }}
//                             />
//                           )}
//                         </div>
//                         {(message.payload as ResultPayload).type ===
//                           "ticket" && (
//                           <TicketsDisplay
//                             key={`${index}-${message.id}-tickets`}
//                             message={message}
//                           />
//                         )}
//                         {((message.payload as ResultPayload).type === "product" ||
//                           (message.payload as ResultPayload).type === "ecommerce") && (
//                           <ProductDisplay
//                             key={`${index}-${message.id}-product`}
//                             payload={message.payload as ResultPayload}
//                           />
//                         )}
//                         {(message.payload as ResultPayload).type ===
//                           "conversation" && (
//                           <ConversationsDisplay
//                             key={`${index}-${message.id}-conversations`}
//                             payload={
//                               (message.payload as ResultPayload)
//                                 .objects as ConversationDisplayType[]
//                             }
//                           />
//                         )}
//                         {(message.payload as ResultPayload).type ===
//                           "message" && (
//                           <ConversationMessageDisplay
//                             key={`${index}-${message.id}-conversations`}
//                             payload={
//                               (message.payload as ResultPayload)
//                                 .objects as ConversationMessage[]
//                             }
//                           />
//                         )}
//                         {((message.payload as ResultPayload).type ===
//                           "boring_generic" ||
//                           (message.payload as ResultPayload).type ===
//                             "mapped") && (
//                           <BoringGenericDisplay
//                             key={`${index}-${message.id}-boring_generic`}
//                             payload={
//                               (message.payload as ResultPayload).objects as {
//                                 [key: string]: string;
//                               }[]
//                             }
//                           />
//                         )}
//                         {(message.payload as ResultPayload).type ===
//                           "aggregation" && (
//                           <AggregationDisplay
//                             key={`${index}-${message.id}-aggregation`}
//                             aggregation={
//                               (message.payload as ResultPayload)
//                                 .objects as AggregationPayload[]
//                             }
//                           />
//                         )}
//                         {(message.payload as ResultPayload).type ===
//                           "document" && (
//                           <DocumentDisplay
//                             key={`${index}-${message.id}-document`}
//                             payload={
//                               (message.payload as ResultPayload)
//                                 .objects as DocumentPayload[]
//                             }
//                           />
//                         )}
//                       </div>
//                     )}
//                     {message.type === "merged_result" && (
//                       <div className="w-full flex flex-col justify-start items-start gap-3">
//                         <div className="flex flex-wrap">
//                           {(message.payload as MergedDocumentPayload)
//                             .code_metadata &&
//                             (
//                               message.payload as MergedDocumentPayload
//                             ).code_metadata.map((code_metadata, c_index) => (
//                               <CodeDisplay
//                                 key={`${c_index}-${message.id}-code-${c_index}`}
//                                 payload={code_metadata.code}
//                                 metadata={code_metadata.metadata}
//                               />
//                             ))}
//                         </div>
//                         {(message.payload as MergedDocumentPayload).type ===
//                           "merged_document" && (
//                           <DocumentDisplay
//                             key={`${index}-${message.id}-document`}
//                             payload={
//                               (message.payload as MergedDocumentPayload)
//                                 .objects as DocumentPayload[]
//                             }
//                           />
//                         )}
//                         {(message.payload as MergedConversationPayload).type ===
//                           "merged_conversation" && (
//                           <ConversationsDisplay
//                             key={`${index}-${message.id}-conversation`}
//                             payload={
//                               (message.payload as MergedConversationPayload)
//                                 .objects as ConversationDisplayType[]
//                             }
//                           />
//                         )}
//                       </div>
//                     )}
//                     {message.type === "text" && (
//                       <div className="w-full flex flex-col justify-start items-start ">
//                         {(message.payload as ResponsePayload).type ===
//                           "response" && (
//                           <TextDisplay
//                             key={`${index}-${message.id}-response`}
//                             payload={
//                               (message.payload as ResponsePayload)
//                                 .objects as TextPayload[]
//                             }
//                           />
//                         )}
//                         {(message.payload as ResponsePayload).type ===
//                           "summary" && (
//                           <SummaryDisplay
//                             key={`${index}-${message.id}-summary`}
//                             payload={
//                               (message.payload as ResponsePayload)
//                                 .objects as SummaryPayload[]
//                             }
//                           />
//                         )}
//                       </div>
//                     )}
//                     {["error", "authentication_error"].includes(
//                       message.type
//                     ) && (
//                       <ErrorMessageDisplay
//                         key={`${index}-${message.id}-error`}
//                         error={(message.payload as TextPayload).text}
//                       />
//                     )}
//                     {["tree_timeout_error"].includes(message.type) && (
//                       <InfoMessageDisplay
//                         key={`${index}-${message.id}-info`}
//                         info={(message.payload as TextPayload).text}
//                       />
//                     )}
//                     {["rate_limit_error"].includes(message.type) && (
//                       <RateLimitMessageDisplay
//                         key={`${index}-${message.id}-info`}
//                         payload={message.payload as RateLimitPayload}
//                       />
//                     )}
//                     {message.type === "warning" && (
//                       <WarningDisplay
//                         key={`${index}-${message.id}-warning`}
//                         warning={(message.payload as TextPayload).text}
//                       />
//                     )}
//                   </div>
//                 ))}
//             </div>
//             {finished && (
//               <ResponseButtons
//                 conversationID={conversationID}
//                 queryID={queryID}
//                 messages={messages}
//                 query_start={query_start}
//                 query_end={query_end}
//                 feedback={feedback}
//                 updateFeedback={updateFeedback}
//               />
//             )}
//             {displayMessages
//               .filter((m) => m.type === "suggestion")
//               .map((message, index) => (
//                 <div
//                   key={`${index}-${message.id}-message`}
//                   className="w-full flex"
//                 >
//                   {message.type === "suggestion" && isLastQuery && (
//                     <SuggestionDisplay
//                       key={`${index}-${message.id}-suggestion`}
//                       payload={message.payload as SuggestionPayload}
//                       handleSendQuery={handleSendQuery}
//                     />
//                   )}
//                 </div>
//               ))}
//           </div>
//         )}
//         {!collapsed && <div ref={messagesEndRef} />}
//         {!socketOnline && (
//           <div className="w-full flex justify-center items-center">
//             <p className="text-primary text-sm shine">
//               Connection lost. Reconnecting...
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageDisplay;
