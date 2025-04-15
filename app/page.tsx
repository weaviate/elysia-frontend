"use client";

import React, { useEffect, useState, useRef, useContext } from "react";

import { DecisionTreeNode, Query } from "./components/types";

import QueryInput from "./components/chat/QueryInput";
import MessageDisplay from "./components/chat/message-display";
import { BsChatFill } from "react-icons/bs";
import { RiFlowChart } from "react-icons/ri";
import FlowDisplay from "./components/chat/flow-display";
import { ReactFlowProvider } from "@xyflow/react";
import { CgDebug } from "react-icons/cg";
import DebugView from "./components/debugging/debug";
import { SocketContext } from "./components/contexts/SocketContext";
import { SessionContext } from "./components/contexts/SessionContext";
import { ConversationContext } from "./components/contexts/ConversationContext";
import { v4 as uuidv4 } from "uuid";
import { useDebug } from "./components/debugging/useDebug";
import RateLimitDialog from "./components/navigation/RateLimitDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import dynamic from "next/dynamic";

const AbstractSphereScene = dynamic(
  () => import("@/app/components/threejs/AbstractSphere"),
  {
    ssr: false,
  }
);

export default function Home() {
  const { sendQuery, socketOnline } = useContext(SocketContext);
  const { id, userLimit, showRateLimitDialog } = useContext(SessionContext);
  const {
    changeBaseToQuery,
    setConversationTitle,
    addTreeToConversation,
    addQueryToConversation,
    currentConversation,
    conversations,
    updateNERForQuery,
    updateFeedbackForQuery,
  } = useContext(ConversationContext);

  const { fetchDebug } = useDebug(id || "");

  const [currentQuery, setCurrentQuery] = useState<{
    [key: string]: Query;
  }>({});
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [mode, setMode] = useState<"chat" | "flow" | "debug">("chat");
  const [currentTrees, setCurrentTrees] = useState<DecisionTreeNode[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displacementStrength = useRef(0.0);
  const distortionStrength = useRef(0.0);

  const addDisplacement = (value: number) => {
    displacementStrength.current += value;
    displacementStrength.current = Math.min(displacementStrength.current, 0.28);
  };

  const addDistortion = (value: number) => {
    distortionStrength.current += value;
    distortionStrength.current = Math.min(distortionStrength.current, 0.65);
  };

  const handleSendQuery = async (
    query: string,
    route?: string,
    mimick?: boolean
  ) => {
    if (query.trim() === "" || currentStatus !== "") return;
    const trimmedQuery = query.trim();
    const query_id = uuidv4();
    const use_auth = true;

    const current_conversation = currentConversation || "";
    sendQuery(
      id || "",
      trimmedQuery,
      current_conversation,
      query_id,
      route,
      mimick,
      use_auth
    );
    changeBaseToQuery(current_conversation, trimmedQuery);
    setConversationTitle(trimmedQuery, current_conversation);
    addTreeToConversation(current_conversation);
    addQueryToConversation(current_conversation, trimmedQuery, query_id);
  };

  useEffect(() => {
    setCurrentQuery(
      currentConversation && conversations.length > 0
        ? conversations.find((c) => c.id === currentConversation)?.queries || {}
        : {}
    );
    setCurrentStatus(
      currentConversation && conversations.length > 0
        ? conversations.find((c) => c.id === currentConversation)?.current || ""
        : ""
    );
    setCurrentTrees(
      currentConversation && conversations.length > 0
        ? conversations.find((c) => c.id === currentConversation)?.tree || []
        : []
    );
  }, [currentConversation, conversations]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [currentQuery, currentStatus]);

  useEffect(() => {
    setMode("chat");
  }, [currentConversation]);

  if (!socketOnline) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <p className="text-primary text-sm shine">
          Connection lost. Reconnecting...
        </p>
      </div>
    );
  }

  if (currentConversation === "" || currentConversation === null) {
    return null;
  }

  return (
    <div className="flex flex-col w-full items-center justify-start">
      <div className="flex w-full justify-between items-center lg:relative absolute z-20 top-0 lg:p-0 p-4">
        <div className="flex flex-col gap-2"></div>
        {Object.keys(currentQuery).length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                {mode === "chat" ? (
                  <>
                    <BsChatFill size={14} />
                    Chat
                  </>
                ) : mode === "flow" ? (
                  <>
                    <RiFlowChart size={14} />
                    Tree
                  </>
                ) : (
                  <>
                    <CgDebug size={14} />
                    Debug
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setMode("chat")}>
                <BsChatFill size={14} />
                Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode("flow")}>
                <RiFlowChart size={14} />
                Tree
              </DropdownMenuItem>
              {process.env.NODE_ENV === "development" && (
                <DropdownMenuItem onClick={() => setMode("debug")}>
                  <CgDebug size={14} />
                  Debug
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {mode === "chat" ? (
        <div className="flex flex-col w-full overflow-scroll justify-center items-center">
          <div className="flex flex-col w-full md:w-[60vw] lg:w-[40vw] h-[90vh] ">
            {Object.entries(currentQuery)
              .sort((a, b) => a[1].index - b[1].index)
              .map(([queryId, query], index, array) => (
                <MessageDisplay
                  key={queryId}
                  messages={query.messages}
                  conversationID={currentConversation || ""}
                  queryID={queryId}
                  finished={query.finished}
                  query_start={query.query_start}
                  query_end={query.query_end}
                  _collapsed={index !== array.length - 1}
                  messagesEndRef={messagesEndRef}
                  NER={query.NER}
                  updateNER={updateNERForQuery}
                  feedback={query.feedback}
                  updateFeedback={updateFeedbackForQuery}
                  addDisplacement={addDisplacement}
                  addDistortion={addDistortion}
                  handleSendQuery={handleSendQuery}
                  isLastQuery={index === array.length - 1}
                />
              ))}
            {!(Object.keys(currentQuery).length === 0) && (
              <div>
                <hr className="w-full border-t border-transparent my-4 mb-20" />
              </div>
            )}
          </div>
          <div className="w-full justify-center items-center flex z-10">
            <QueryInput
              query_length={Object.keys(currentQuery).length}
              currentStatus={currentStatus}
              handleSendQuery={handleSendQuery}
              addDisplacement={addDisplacement}
              addDistortion={addDistortion}
              userLimit={userLimit}
            />
          </div>
          {Object.keys(currentQuery).length === 0 && (
            <div
              className={`absolute flex pointer-events-none -z-30 items-center justify-center lg:w-fit lg:h-fit w-full h-full`}
            >
              <div
                className={`cursor-pointer lg:w-[50vw] lg:h-[50vw] w-full h-full  `}
              >
                <AbstractSphereScene
                  debug={false}
                  displacementStrength={displacementStrength}
                  distortionStrength={distortionStrength}
                />
              </div>
            </div>
          )}
        </div>
      ) : mode === "flow" ? (
        <ReactFlowProvider>
          <FlowDisplay currentTrees={currentTrees} />
        </ReactFlowProvider>
      ) : (
        <DebugView
          fetchDebug={fetchDebug}
          currentConversation={currentConversation || ""}
          conversations={conversations}
        />
      )}
      {showRateLimitDialog && <RateLimitDialog />}
    </div>
  );
}
