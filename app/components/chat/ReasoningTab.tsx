import { useContext, useEffect, useState } from "react";
import { ConversationContext } from "../contexts/ConversationContext";
import { Conversation } from "../types";
import { TextPayload } from "@/app/types/chat";
import ReasoningEntry from "./ReasoningEntry";
import { motion } from "framer-motion";
import { IoChevronBack } from "react-icons/io5";
import { TbBrain } from "react-icons/tb";

const ReasoningTab = () => {
  const { currentConversation, conversations } = useContext(ConversationContext);
  const [currentConversationObject, setCurrentConversationObject] = useState<Conversation | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentlyStreamingReasoning, setCurrentlyStreamingReasoning] = useState<boolean>(false);

  useEffect(() => {
    const conversationObject = conversations.find(
      (c) => c.id === currentConversation
    );
    if (conversationObject) {
      setCurrentConversationObject(conversationObject);
      let isStreaming = false;
      Object.entries(conversationObject.queries).forEach(([, query]) => {
        Object.entries(query.messages).forEach(([, message]) => {
          if (message.streamed) {
            isStreaming = true;
          }
        });
      });
      setCurrentlyStreamingReasoning(isStreaming);
    }
  }, [currentConversation, conversations]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className="flex"
    >
      {/* Glassy container with width animation */}
      <div
        className={`
          relative overflow-hidden rounded-xl
          bg-background/60 backdrop-blur-md
          border border-foreground/10
          shadow-sm
          cursor-pointer
        `}
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.02)",
          width: isCollapsed ? 40 : 280,
          transition: "width 0.3s ease-in-out",
        }}
        onClick={() => isCollapsed && setIsCollapsed(false)}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.02] to-transparent pointer-events-none" />

        <div className="flex flex-col relative">
          {/* Collapsed state - vertical bar */}
          {isCollapsed ? (
            <div className="flex flex-col items-center py-3 gap-2">
              <motion.div
                className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary/10 text-secondary/70"
                animate={currentlyStreamingReasoning ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: currentlyStreamingReasoning ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <TbBrain size={14} />
              </motion.div>
              {currentlyStreamingReasoning && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-accent/60"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>
          ) : (
            <>
              {/* Header - expanded */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(true);
                }}
                className="flex items-center justify-between gap-2 px-3 py-2.5 w-full hover:bg-foreground/5 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary/10 text-secondary/70"
                    animate={currentlyStreamingReasoning ? {
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: currentlyStreamingReasoning ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  >
                    <TbBrain size={14} />
                  </motion.div>
                  <span className="text-xs font-medium text-secondary/80 uppercase tracking-wider whitespace-nowrap">
                    Reasoning
                  </span>
                  {currentlyStreamingReasoning && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-accent/60"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </div>
                <motion.div
                  className="text-secondary/50 group-hover:text-secondary/70 transition-colors"
                >
                  <IoChevronBack size={12} />
                </motion.div>
              </button>

              {/* Divider */}
              <div className="mx-3 h-px bg-foreground/5" />

              {/* Content area */}
              <div className="overflow-y-auto px-3 py-2 max-h-[calc(100vh-200px)]">
                {Object.entries(currentConversationObject?.queries || {}).length === 0 ? (
                  <p className="text-[11px] text-secondary/40 text-center py-4 whitespace-nowrap">
                    Reasoning will appear here...
                  </p>
                ) : (
                  Object.entries(currentConversationObject?.queries || {}).map(([queryId, query]) => (
                    Object.entries(query.messages).map(([messageId, message]) => (
                      message.type === "text" && (message.payload as TextPayload).metadata.reasoning === true && (
                        <motion.div
                          key={`${queryId}-${messageId}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <ReasoningEntry payload={message.payload as TextPayload} />
                        </motion.div>
                      )
                    ))
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReasoningTab;