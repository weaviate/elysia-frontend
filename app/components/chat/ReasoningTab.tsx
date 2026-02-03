import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { ConversationContext } from "../contexts/ConversationContext";
import { Conversation } from "../types";
import { Message, TextPayload, SelfHealingErrorPayload } from "@/app/types/chat";
import ReasoningEntry from "./ReasoningEntry";
import SelfHealingEntry from "./SelfHealingEntry";
import ViewEnvironmentEntry from "./ViewEnvironmentEntry";
import { motion } from "framer-motion";
import { IoChevronBack } from "react-icons/io5";
import { TbBrain } from "react-icons/tb";
import { Checkbox } from "@/components/ui/checkbox";

const ReasoningTab = () => {
  const { currentConversation, conversations } = useContext(ConversationContext);
  const [currentConversationObject, setCurrentConversationObject] = useState<Conversation | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentlyStreamingReasoning, setCurrentlyStreamingReasoning] = useState<boolean>(false);
  const [showAll, setShowAll] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Collect all entries in order
  type EntryType = { queryId: string; messageId: string; message: Message; entryType: "reasoning" | "self_healing" | "view_environment" };
  
  const { allEntries, hasSelfHealingErrors } = useMemo(() => {
    const entries: EntryType[] = [];
    let hasErrors = false;
    
    Object.entries(currentConversationObject?.queries || {}).forEach(([queryId, query]) => {
      Object.entries(query.messages).forEach(([messageId, message]) => {
        if (
          message?.type === "text" &&
          (message.payload as TextPayload)?.metadata?.reasoning === true
        ) {
          entries.push({ queryId, messageId, message, entryType: "reasoning" });
        }
        if (message?.type === "self_healing_error") {
          entries.push({ queryId, messageId, message, entryType: "self_healing" });
          hasErrors = true;
        }
        if (message?.type === "view_environment") {
          entries.push({ queryId, messageId, message, entryType: "view_environment" });
        }
      });
    });
    
    return { allEntries: entries, hasSelfHealingErrors: hasErrors };
  }, [currentConversationObject]);

  // Auto-scroll to bottom when new entries appear
  useEffect(() => {
    if (scrollContainerRef.current && allEntries.length > 0) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [allEntries]);

  useEffect(() => {
    const conversationObject = conversations.find(
      (c) => c.id === currentConversation
    );
    if (conversationObject) {
      setCurrentConversationObject(conversationObject);
      let isStreaming = false;
      Object.entries(conversationObject.queries).forEach(([, query]) => {
        Object.entries(query.messages).forEach(([, message]) => {
          if (message?.streamed) {
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
                className={`flex items-center justify-center w-6 h-6 rounded-md ${
                  hasSelfHealingErrors ? "bg-highlight/10 text-highlight/70" : "bg-accent/10 text-accent/70"
                }`}
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
                  className={`w-1.5 h-1.5 rounded-full ${hasSelfHealingErrors ? "bg-highlight/60" : "bg-accent/60"}`}
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
                    className={`flex items-center justify-center w-6 h-6 rounded-md ${
                      hasSelfHealingErrors ? "bg-highlight/10 text-highlight/70" : "bg-accent/10 text-accent/70"
                    }`}
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
                  <span className={`text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
                    hasSelfHealingErrors ? "text-highlight/80" : "text-accent/80"
                  }`}>
                    Reasoning
                  </span>
                  {currentlyStreamingReasoning && (
                    <motion.div
                      className={`w-1.5 h-1.5 rounded-full ${hasSelfHealingErrors ? "bg-highlight/60" : "bg-accent/60"}`}
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
                  className={`${hasSelfHealingErrors ? "text-highlight/50 group-hover:text-highlight/70" : "text-accent/50 group-hover:text-accent/70"} transition-colors`}
                >
                  <IoChevronBack size={12} />
                </motion.div>
              </button>

              {/* Show all checkbox */}
              <div className="flex items-center justify-end gap-2 px-3 py-1.5">
                <Checkbox
                  id="show-all"
                  checked={showAll}
                  onCheckedChange={(checked) => setShowAll(checked === true)}
                  className={`h-3 w-3 border-foreground/20 ${hasSelfHealingErrors ? "data-[state=checked]:bg-highlight data-[state=checked]:border-highlight" : "data-[state=checked]:bg-accent data-[state=checked]:border-accent"}`}
                />
                <label
                  htmlFor="show-all"
                  className="text-[10px] text-secondary/60 cursor-pointer select-none"
                  onClick={() => setShowAll(!showAll)}
                >
                  Show all
                </label>
              </div>

              {/* Divider */}
              <div className="mx-3 h-px bg-foreground/5" />

              {/* Content area */}
              <div
                ref={scrollContainerRef}
                className="overflow-y-auto px-3 py-2 max-h-[calc(100vh-200px)]"
              >
                {allEntries.length === 0 ? (
                  <p className="text-[11px] text-secondary/40 text-center py-4 whitespace-nowrap">
                    Reasoning will appear here...
                  </p>
                ) : (
                  (showAll ? allEntries : allEntries.slice(-1)).map(({ queryId, messageId, message, entryType }, index, arr) => {
                    const isLast = index === arr.length - 1;
                    return (
                      <motion.div
                        key={`${entryType}-${queryId}-${messageId}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {entryType === "reasoning" && (
                          <ReasoningEntry
                            payload={message.payload as TextPayload}
                            isLast={isLast}
                          />
                        )}
                        {entryType === "self_healing" && (
                          <SelfHealingEntry
                            payload={message.payload as SelfHealingErrorPayload}
                            isLast={isLast}
                          />
                        )}
                        {entryType === "view_environment" && (
                          <ViewEnvironmentEntry isLast={isLast} />
                        )}
                      </motion.div>
                    );
                  })
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