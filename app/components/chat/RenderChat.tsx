"use client";

import React, { useContext, useEffect, useState } from "react";

import {
  Message,
  ResponsePayload,
  SummaryPayload,
  ResultPayload,
  TextPayload,
  NERPayload,
  RateLimitPayload,
  SuggestionPayload,
  SystemTextPayload,
} from "@/app/types/chat";

import UserMessageDisplay from "./displays/SystemMessages/UserMessageDisplay";
import ErrorMessageDisplay from "./displays/SystemMessages/ErrorMessageDisplay";
import TextDisplay from "./displays/Generic/TextDisplay";
import WarningDisplay from "./displays/SystemMessages/WarningDisplay";
import CodeDisplay from "./components/ViewCodeButton";
import FeedbackButtons from "./components/FeedbackButtons";
import InfoMessageDisplay from "./displays/SystemMessages/InfoMessageDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { SocketContext } from "../contexts/SocketContext";
import RateLimitMessageDisplay from "./displays/SystemMessages/RateLimitMessageDisplay";
import SuggestionDisplay from "./displays/SystemMessages/SuggestionDisplay";
import RenderDisplay from "./RenderDisplay";
import MergeDisplays from "./MergeDisplays";
import RenderDisplayView from "./RenderDisplayView";
import { ChatContext } from "../contexts/ChatContext";
import CodeView from "./displays/QueryCode/CodeView";
import { DisplayProvider } from "../contexts/DisplayContext";

interface RenderChatProps {
  messages: Message[];
  _collapsed: boolean;
  conversationID: string;
  queryID: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  finished: boolean;
  query_start: Date;
  query_end: Date | null;
  NER: NERPayload | null;
  feedback: number | null;
  updateFeedback: (
    conversationId: string,
    queryId: string,
    feedback: number
  ) => void;
  addDisplacement: (value: number) => void;
  addDistortion: (value: number) => void;
  handleSendQuery: (query: string, route?: string, mimick?: boolean) => void;
  isLastQuery: boolean;
}

const RenderChat: React.FC<RenderChatProps> = ({
  messages,
  _collapsed,
  messagesEndRef,
  conversationID,
  queryID,
  finished,
  query_start,
  query_end,
  NER,
  feedback,
  updateFeedback,
  addDisplacement,
  addDistortion,
  handleSendQuery,
  isLastQuery,
}) => {
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(_collapsed);
  const { socketOnline } = useContext(SocketContext);
  const {
    buildRefMap,
    currentView,
    currentPayload,
    currentResultPayload,
    currentResultType,
    handleViewChange,
    handleResultPayloadChange,
  } = useContext(ChatContext);

  const filterMessages = (_messages: Message[]) => {
    return _messages.filter(
      (message) => message != null && message.type !== "training_update"
    );
  };

  useEffect(() => {
    const filtered_messages = filterMessages(messages);
    setDisplayMessages(filtered_messages);
    addDisplacement(0.1);
    addDistortion(0.08);
    if (process.env.NODE_ENV === "development") {
      console.log(messages);
    }
    buildRefMap(filtered_messages);
  }, [messages, addDisplacement, addDistortion]);

  // Message types that are explicitly handled in the render
  const HANDLED_MESSAGE_TYPES = [
    "result",
    "text",
    "error",
    "authentication_error",
    "tree_timeout_error",
    "user_timeout_error",
    "rate_limit_error",
    "warning",
  ];

  // Helper to check if a message is a reasoning text message
  const isReasoningMessage = (m: Message): boolean => {
    if (m.type !== "text") return false;
    const payload = m.payload as TextPayload;
    return payload?.metadata?.reasoning === true;
  };

  // TODO: Revisit when new streaming messages are implemented and response is being removed/replaced
  const processedOutputItems = React.useMemo(() => {
    const output: (
      | Message
      | {
          type: "merged_result";
          id: string;
          originalMessage: Message;
          payloadsToMerge: ResultPayload[];
        }
    )[] = [];
    const messagesToProcess = displayMessages.filter(
      (m) =>
        m != null &&
        m.type !== "User" &&
        m.type !== "suggestion" &&
        HANDLED_MESSAGE_TYPES.includes(m.type) &&
        !isReasoningMessage(m)
    );

    let i = 0;
    while (i < messagesToProcess.length) {
      const currentMessage = messagesToProcess[i];

      if (
        currentMessage.type === "result" &&
        (currentMessage.payload as ResultPayload).type &&
        (currentMessage.payload as ResultPayload).metadata?.collection_name
      ) {
        const currentResultPayload = currentMessage.payload as ResultPayload;
        const group: ResultPayload[] = [currentResultPayload];
        let j = i + 1;

        while (j < messagesToProcess.length) {
          const nextMessage = messagesToProcess[j];
          if (nextMessage.type === "result") {
            const nextResultPayload = nextMessage.payload as ResultPayload;
            if (
              nextResultPayload.type === currentResultPayload.type &&
              nextResultPayload.metadata?.collection_name
            ) {
              group.push(nextResultPayload);
              j++;
            } else {
              break;
            }
          } else {
            break;
          }
        }

        if (group.length > 1) {
          output.push({
            type: "merged_result",
            id: currentMessage.id,
            originalMessage: currentMessage,
            payloadsToMerge: group,
          });
          i = j;
          continue;
        }
      }

      output.push(currentMessage);
      i++;
    }
    return output;
  }, [displayMessages]);

  return (
    <div
      className={`flex justify-start items-start w-full p-4 transition-all  duration-300`}
    >
      {currentView === "chat" && (
        <div className="flex flex-col gap-4 w-full relative z-10 rounded-lg">
          {displayMessages
            .filter((m) => m.type === "User")
            .map((message, index) => (
              <div
                key={`${index}-${message.id}-message`}
                className="w-full flex"
              >
                {message.type === "User" && (
                  <UserMessageDisplay
                    NER={NER}
                    onClick={() => setCollapsed((prev) => !prev)}
                    key={`${index}-${message.id}-user`}
                    payload={
                      (message.payload as ResultPayload).objects as string[]
                    }
                    collapsed={collapsed}
                  />
                )}
              </div>
            ))}
          {!collapsed &&
            displayMessages.length < 2 &&
            socketOnline &&
            !finished && (
              <div className="w-full flex-col flex gap-2 justify-start items-start fade-in">
                <Skeleton className="w-full h-[1rem]" />
                <Skeleton className="w-1/2 h-[1rem]" />
                <Skeleton className="w-2/5 h-[1rem]" />
                <Skeleton className="w-2/5 h-[1rem]" />
              </div>
            )}
          {!collapsed && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-5">
                {processedOutputItems.map((item, index) => {
                  const message =
                    item.type === "merged_result"
                      ? item.originalMessage
                      : (item as Message);
                  const key = `${index}-${message.id}-processed-item`;

                  return (
                    <DisplayProvider
                      key={`${index}-${message.id}-display-provider`}
                      _payload={message.payload as ResultPayload}
                    >
                      <div key={key} className="w-full flex">
                        {/* Merged Result Messages */}
                        {item.type === "merged_result" && (
                          <div className="w-full flex flex-row justify-start items-start gap-3">
                            <MergeDisplays
                              payloadsToMerge={item.payloadsToMerge}
                              baseKey={`${index}-${item.id}`}
                              messageId={item.id}
                              handleViewChange={handleViewChange}
                              handleResultPayloadChange={
                                handleResultPayloadChange
                              }
                            />
                          </div>
                        )}
                        {/* Result Messages */}
                        {item.type !== "merged_result" &&
                          message.type === "result" && (
                            <div className="w-full flex flex-col justify-start items-start gap-3">
                              {(message.payload as ResultPayload).code && (
                                <CodeDisplay
                                  payload={[message.payload as ResultPayload]}
                                  merged={false}
                                  handleViewChange={handleViewChange}
                                />
                              )}
                              <RenderDisplay
                                payload={message.payload as ResultPayload}
                                index={index}
                                messageId={message.id}
                                handleResultPayloadChange={
                                  handleResultPayloadChange
                                }
                              />
                            </div>
                          )}
                        {/* Text Messages (non-reasoning only) */}
                        {item.type !== "merged_result" &&
                          message.type === "text" && (message.payload as TextPayload).metadata?.reasoning !== true && (
                            <div className="w-full flex flex-col justify-start items-start ">
                              <TextDisplay
                                  key={`${index}-${message.id}-response`}
                                  payload={message.payload as TextPayload}
                                  
                                />
    
                            </div>
                          )}
                        {/* Error Messages */}
                        {item.type !== "merged_result" &&
                          ["error", "authentication_error"].includes(
                            message.type
                          ) && (
                            <ErrorMessageDisplay
                              key={`${index}-${message.id}-error`}
                              error={(message.payload as SystemTextPayload).text}
                            />
                          )}
                        {item.type !== "merged_result" &&
                          ["tree_timeout_error", "user_timeout_error"].includes(
                            message.type
                          ) && (
                            <InfoMessageDisplay
                              key={`${index}-${message.id}-info`}
                              info={(message.payload as SystemTextPayload).text}
                            />
                          )}
                        {item.type !== "merged_result" &&
                          ["rate_limit_error"].includes(message.type) && (
                            <RateLimitMessageDisplay
                              key={`${index}-${message.id}-info`}
                              payload={message.payload as RateLimitPayload}
                            />
                          )}
                        {item.type !== "merged_result" &&
                          message.type === "warning" && (
                            <WarningDisplay
                              key={`${index}-${message.id}-warning`}
                              warning={(message.payload as SystemTextPayload).text}
                            />
                          )}
                      </div>
                    </DisplayProvider>
                  );
                })}
              </div>
              {finished && (
                <FeedbackButtons
                  conversationID={conversationID}
                  queryID={queryID}
                  messages={messages}
                  query_start={query_start}
                  query_end={query_end}
                  feedback={feedback}
                  updateFeedback={updateFeedback}
                />
              )}
              {displayMessages
                .filter((m) => m.type === "suggestion")
                .map((message, index) => (
                  <div
                    key={`${index}-${message.id}-message`}
                    className="w-full flex"
                  >
                    {message.type === "suggestion" && isLastQuery && (
                      <SuggestionDisplay
                        key={`${index}-${message.id}-suggestion`}
                        payload={message.payload as SuggestionPayload}
                        handleSendQuery={handleSendQuery}
                      />
                    )}
                  </div>
                ))}
            </div>
          )}
          {!collapsed && <div ref={messagesEndRef} />}
          {!socketOnline && (
            <div className="w-full flex justify-center items-center">
              <p className="text-primary text-sm shine">
                Connection lost. Reconnecting...
              </p>
            </div>
          )}
        </div>
      )}
      {currentView === "code" && (
        <div className="w-full flex flex-col gap-4">
          <CodeView
            payload={currentPayload as ResultPayload[]}
            handleViewChange={handleViewChange}
          />
        </div>
      )}
      {currentView === "result" && (
        <div className="w-full flex flex-col gap-4">
          <RenderDisplayView
            payload={currentResultPayload}
            type={currentResultType}
            handleViewChange={handleViewChange}
          />
        </div>
      )}
    </div>
  );
};

export default RenderChat;
