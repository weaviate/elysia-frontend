"use client";

import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import { motion } from "framer-motion";

import { Query, Message, ResultPayload } from "@/app/types/chat";
import { MdChatBubbleOutline } from "react-icons/md";

import QueryInput from "../components/chat/QueryInput";
import RenderChat from "../components/chat/RenderChat";
import FlowDisplay from "../components/chat/FlowDisplay";
import { SocketContext } from "../components/contexts/SocketContext";
import { SessionContext } from "../components/contexts/SessionContext";
import { ConversationContext } from "../components/contexts/ConversationContext";
import { ChatProvider, ChatContext } from "../components/contexts/ChatContext";
import { v4 as uuidv4 } from "uuid";
import RateLimitDialog from "../components/navigation/RateLimitDialog";
import { IoRefresh } from "react-icons/io5";
import ReasoningTab from "../components/chat/ReasoningTab";
import { IoChatbubblesSharp } from "react-icons/io5";
import { PiTreeStructureBold } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";

import { Button } from "@/components/ui/button";

import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { CollectionContext } from "../components/contexts/CollectionContext";
import TreeSettingsView from "../components/configuration/TreeSettingsView";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { TreeContext } from "../components/contexts/TreeContext";
import CodeView from "../components/chat/displays/QueryCode/CodeView";
import RenderDisplayView from "../components/chat/RenderDisplayView";

const AbstractSphereScene = dynamic(
  () => import("@/app/components/threejs/AbstractSphere"),
  {
    ssr: false,
  }
);

// Inner component that uses ChatContext (must be inside ChatProvider)
function ChatPageContent({
  currentQuery,
  currentTitle,
  currentStatus,
  mode,
  setMode,
  messagesEndRef,
  displacementStrength,
  distortionStrength,
  addDisplacement,
  addDistortion,
  randomPrompts,
  setRandomPrompts,
  handleSendQuery,
  selectSettings,
  selectChat,
}: {
  currentQuery: { [key: string]: Query };
  currentTitle: string;
  currentStatus: string;
  mode: "chat" | "flow" | "debug" | "settings";
  setMode: (mode: "chat" | "flow" | "debug" | "settings") => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  displacementStrength: React.MutableRefObject<number>;
  distortionStrength: React.MutableRefObject<number>;
  addDisplacement: (value: number) => void;
  addDistortion: (value: number) => void;
  randomPrompts: string[];
  setRandomPrompts: (prompts: string[]) => void;
  handleSendQuery: (query: string, route?: string, mimick?: boolean) => void;
  selectSettings: () => void;
  selectChat: () => void;
}) {
  const { id } = useContext(SessionContext);
  const { currentConversation, updateFeedbackForQuery, loadingConversation } =
    useContext(ConversationContext);
  const { conversationPresetID } = useContext(TreeContext);
  const { getRandomPrompts, collections } = useContext(CollectionContext);
  const {
    buildRefMap,
    currentView,
    currentPayload,
    currentResultPayload,
    currentResultType,
    handleViewChange,
  } = useContext(ChatContext);

  // Build global ref_map from all messages across all queries
  const allMessages = useMemo(() => {
    const messages: Message[] = [];
    Object.values(currentQuery).forEach((query) => {
      messages.push(...query.messages);
    });
    return messages;
  }, [currentQuery]);

  useEffect(() => {
    buildRefMap(allMessages);
  }, [allMessages]);

  // Random Prompts
  useEffect(() => {
    if (collections.length > 0) {
      setRandomPrompts(getRandomPrompts(4));
    }
  }, [collections]);

  const buttonClass =
    "flex items-center justify-center gap-2 w-8 h-8 hover:bg-highlight/20 cursor-pointer";
  const activeButtonClass = "text-highlight bg-highlight/10";
  const inactiveButtonClass = "bg-background_alt text-secondary";

  // If viewing code or result, show full-screen overlay
  if (currentView === "code" && currentPayload) {
    return (
      <div className="flex flex-col w-full h-[calc(100vh-100px)] min-h-0 items-center justify-start gap-3 overflow-y-auto">
        <div className="w-full md:w-[60vw] lg:w-[50vw]">
          <CodeView payload={currentPayload} handleViewChange={handleViewChange} />
        </div>
      </div>
    );
  }

  if (currentView === "result" && currentResultPayload) {
    return (
      <div className="flex flex-col w-full h-[calc(100vh-100px)] min-h-0 items-center justify-start gap-3 overflow-y-auto">
        <div className="w-full md:w-[60vw] lg:w-[50vw]">
          <RenderDisplayView
            payload={currentResultPayload}
            type={currentResultType}
            handleViewChange={handleViewChange}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex w-full justify-between items-center lg:sticky z-20 top-0 lg:p-0 p-4 gap-5 bg-background">
        <div className="flex gap-2 items-center justify-center fade-in">
          <p className="text-primary text-sm">
            {currentTitle && currentTitle != "New Conversation"
              ? currentTitle
              : "New Conversation"}
          </p>
        </div>
        {currentConversation != null && (
          <div className="flex items-center justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setMode("chat")}
                    className={cn(
                      buttonClass,
                      mode === "chat" ? activeButtonClass : inactiveButtonClass
                    )}
                  >
                    <IoChatbubblesSharp size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chat</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setMode("flow")}
                    className={cn(
                      buttonClass,
                      mode === "flow" ? activeButtonClass : inactiveButtonClass
                    )}
                  >
                    <PiTreeStructureBold size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tree</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setMode("settings")}
                    className={cn(
                      buttonClass,
                      mode === "settings"
                        ? activeButtonClass
                        : inactiveButtonClass
                    )}
                  >
                    <IoIosSettings size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      {currentConversation != null && <Separator className="w-full" />}
      {loadingConversation && (
        <div className="flex w-full h-screen justify-center items-center">
          <p className="text-primary text-xl shine">Loading Conversation...</p>
        </div>
      )}

      {/* Chat View */}
      {mode != "settings" && !loadingConversation ? (
        <div className="flex flex-col w-full h-[calc(100vh-120px)]">
          {/* Top area */}
          <div className="flex-1 overflow-hidden relative">
            {/* Chat Mode WITH queries: Chat + Reasoning side by side */}
            {mode === "chat" && Object.keys(currentQuery).length > 0 && (
              <div className="flex w-full h-full justify-center">
                {/* Left spacer for centering */}
                <div className="hidden lg:block flex-1" />

                {/* Chat Messages (scrollable) */}
                <div className="w-full md:w-[60vw] lg:w-[50vw] h-full overflow-y-auto">
                  {Object.entries(currentQuery)
                    .sort((a, b) => a[1].index - b[1].index)
                    .map(([queryId, query], index, array) => (
                      <RenderChat
                        key={queryId + index}
                        messages={query.messages}
                        conversationID={currentConversation || ""}
                        queryID={queryId}
                        finished={query.finished}
                        query_start={query.query_start}
                        query_end={query.query_end}
                        _collapsed={index !== array.length - 1}
                        messagesEndRef={messagesEndRef}
                        NER={query.NER}
                        feedback={query.feedback}
                        updateFeedback={updateFeedbackForQuery}
                        addDisplacement={addDisplacement}
                        addDistortion={addDistortion}
                        handleSendQuery={handleSendQuery}
                        isLastQuery={index === array.length - 1}
                      />
                    ))}
                  {/* Separator */}
                  <div>
                    <hr className="w-full border-t border-transparent my-4 mb-20" />
                  </div>
                </div>

                {/* Right: Reasoning Tab (doesn't scroll with chat) */}
                <div className="hidden lg:flex flex-1 justify-center items-start py-4">
                  <ReasoningTab />
                </div>
              </div>
            )}

            {/* Chat Mode WITHOUT queries: Empty state (centered independently) */}
            {mode === "chat" && Object.keys(currentQuery).length === 0 && (
              <div className="flex w-full h-full items-center justify-center">
                {/* Abstract Sphere Scene */}
                <div className="absolute inset-0 flex pointer-events-none -z-30 items-center justify-center fade-in">
                  <div className="cursor-pointer lg:w-[35vw] lg:h-[35vw] w-[90vw] h-[90vw]">
                    <AbstractSphereScene
                      debug={false}
                      displacementStrength={displacementStrength}
                      distortionStrength={distortionStrength}
                    />
                  </div>
                </div>

                {/* Random Prompts */}
                <div className="flex flex-col justify-center items-center gap-3 fade-in">
                  <div className="flex items-center gap-4">
                    <p className="text-primary text-3xl font-semibold">
                      Ask Elysia
                    </p>
                    <Button
                      variant="default"
                      className="w-10"
                      onClick={() => {
                        setRandomPrompts(getRandomPrompts(4));
                      }}
                    >
                      <IoRefresh />
                    </Button>
                  </div>

                  <motion.div
                    className="flex flex-col w-full md:w-[60vw] lg:w-[40vw] gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      staggerChildren: 0.03,
                      delayChildren: 0.05,
                    }}
                  >
                    {randomPrompts.map((prompt, index) => (
                      <motion.button
                        key={index + "prompt"}
                        onClick={() =>
                          handleSendQuery(prompt, conversationPresetID || "")
                        }
                        className="whitespace-normal px-4 pt-2 text-left h-auto hover:bg-foreground text-sm rounded-lg transition-all duration-200 ease-in-out flex flex-col items-start justify-start overflow-hidden relative group"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: index * 0.03,
                          ease: "easeOut",
                        }}
                        whileHover={{
                          scale: 1.02,
                          y: -2,
                          transition: { duration: 0.1 },
                        }}
                        whileTap={{
                          scale: 0.98,
                          y: 0,
                        }}
                      >
                        <div className="flex items-center justify-start gap-2 relative z-10">
                          <motion.div
                            whileHover={{
                              scale: 1.1,
                              rotate: [0, -10, 10, -5, 5, 0],
                              transition: {
                                duration: 0.5,
                                ease: "easeInOut",
                                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                              },
                            }}
                          >
                            <MdChatBubbleOutline size={14} />
                          </motion.div>
                          <motion.p
                            className="text-primary text-sm truncate lg:w-[35vw] w-[80vw]"
                            initial={{ opacity: 0.8 }}
                            whileHover={{
                              opacity: 1,
                              transition: { duration: 0.2 },
                            }}
                          >
                            {prompt}
                          </motion.p>
                        </div>
                        <motion.div
                          className="border-b border-foreground w-full pt-2 origin-left"
                          initial={{ scaleX: 0, opacity: 0.3 }}
                          whileHover={{
                            scaleX: 1,
                            opacity: 1,
                            transition: { duration: 0.3, ease: "easeOut" },
                          }}
                        />

                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg opacity-0"
                          whileHover={{
                            opacity: 1,
                            transition: { duration: 0.3 },
                          }}
                        />
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              </div>
            )}

            {/* Flow Display (full width, no constraints) */}
            {mode === "flow" && <FlowDisplay />}
          </div>

          {/* Bottom: Query Input (always centered, unaffected by reasoning) */}
          <div className="w-full flex justify-center shrink-0">
            <div className="w-full md:w-[60vw] lg:w-[40vw]">
              <QueryInput
                query_length={Object.keys(currentQuery).length}
                currentStatus={currentStatus}
                handleSendQuery={handleSendQuery}
                addDisplacement={addDisplacement}
                addDistortion={addDistortion}
                selectSettings={selectSettings}
              />
            </div>
          </div>
        </div>
      ) : mode === "settings" ? (
        <TreeSettingsView
          user_id={id || ""}
          conversation_id={currentConversation || ""}
          selectChat={selectChat}
        />
      ) : null}
    </>
  );
}

export default function ChatPage() {
  const { sendQuery, socketOnline } = useContext(SocketContext);
  const { id, showRateLimitDialog } = useContext(SessionContext);
  const {
    addQueryToConversation,
    currentConversation,
    conversations,
    changePresetID,
  } = useContext(ConversationContext);
  const { toolPresets, conversationPresetID } = useContext(TreeContext);

  const { getRandomPrompts, collections } = useContext(CollectionContext);

  const [currentQuery, setCurrentQuery] = useState<{
    [key: string]: Query;
  }>({});
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [mode, setMode] = useState<"chat" | "flow" | "debug" | "settings">(
    "chat"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displacementStrength = useRef(0.0);
  const distortionStrength = useRef(0.0);

  const addDisplacement = (value: number) => {
    displacementStrength.current += value;
    displacementStrength.current = Math.min(displacementStrength.current, 0.1);
  };

  const addDistortion = (value: number) => {
    distortionStrength.current += value;
    distortionStrength.current = Math.min(distortionStrength.current, 0.3);
  };

  const [randomPrompts, setRandomPrompts] = useState<string[]>([]);

  const handleSendQuery = async (
    query: string,
    route: string = "",
    mimick: boolean = false
  ) => {
    if (query.trim() === "" || currentStatus !== "") return;
    const trimmedQuery = query.trim();
    const query_id = uuidv4();

    const preset_id = toolPresets.find(
      (p) => p.name === conversationPresetID
    )?.id;

    const _conversation = conversations.find(
      (c) => c.id === currentConversation
    );

    if (_conversation === null || _conversation === undefined) {
      return;
    } else {
      sendQuery(
        id || "",
        trimmedQuery,
        _conversation.id,
        query_id,
        preset_id || "",
        route,
        mimick
      );
      changePresetID(_conversation.id, conversationPresetID || "");
      addQueryToConversation(_conversation.id, trimmedQuery, query_id);
    }
  };

  const selectSettings = () => {
    setMode("settings");
  };

  const selectChat = () => {
    setMode("chat");
  };

  {
    /* Update current query, status, and title when selecting a conversation */
  }
  useEffect(() => {
    const conversationObject = conversations.find(
      (c) => c.id === currentConversation
    );
    if (conversationObject) {
      setCurrentQuery(conversationObject.queries || {});
      setCurrentStatus(conversationObject.current || "");
      setCurrentTitle(conversationObject.name || "");
    }
  }, [currentConversation, conversations]);

  {
    /* Scroll to bottom of chat messages when current query or status changes */
  }
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentQuery, currentStatus]);

  {
    /* Scroll to bottom of chat messages initially */
  }
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, []);

  {
    /* Switch to Chat Mode when selecting a conversation */
  }
  useEffect(() => {
    setMode("chat");
  }, [currentConversation]);

  if (!socketOnline) {
    return (
      <div className="flex flex-col w-screen h-screen items-center justify-center p-2 md:p-6">
        <div
          className={`absolute flex pointer-events-none -z-30 items-center justify-center lg:w-fit lg:h-fit w-full h-full fade-in`}
        >
          <div
            className={`cursor-pointer lg:w-[35vw] lg:h-[35vw] w-[90vw] h-[90vw]  `}
          >
            <AbstractSphereScene
              debug={false}
              displacementStrength={displacementStrength}
              distortionStrength={distortionStrength}
            />
          </div>
        </div>
        <p className="text-primary text-xl shine">Loading Elysia...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-start gap-3 p-2 md:p-6">
      <ChatProvider>
        <ChatPageContent
          currentQuery={currentQuery}
          currentTitle={currentTitle}
          currentStatus={currentStatus}
          mode={mode}
          setMode={setMode}
          messagesEndRef={messagesEndRef}
          displacementStrength={displacementStrength}
          distortionStrength={distortionStrength}
          addDisplacement={addDisplacement}
          addDistortion={addDistortion}
          randomPrompts={randomPrompts}
          setRandomPrompts={setRandomPrompts}
          handleSendQuery={handleSendQuery}
          selectSettings={selectSettings}
          selectChat={selectChat}
        />
      </ChatProvider>
      {showRateLimitDialog && <RateLimitDialog />}
    </div>
  );
}
