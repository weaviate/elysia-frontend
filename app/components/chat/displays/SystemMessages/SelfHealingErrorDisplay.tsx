"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownFormat from "../../components/MarkdownFormat";
import {
  SelfHealingErrorPayload,
  MergedSelfHealingErrorPayload,
} from "@/app/types/chat";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaCircle, FaCode, FaCopy, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IoMdCloseCircle } from "react-icons/io";
import CopyToClipboardButton from "@/app/components/navigation/CopyButton";

interface SelfHealingErrorDisplayProps {
  payload: SelfHealingErrorPayload | MergedSelfHealingErrorPayload;
}

// Animation variants for Framer Motion
const containerVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
      staggerChildren: 0.1,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [0.2, 0.35, 0.2],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const slideVariants = {
  feedback: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 100,
    },
  },
  error: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 100,
    },
  },
  exit: {
    x: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const expandVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
      opacity: {
        duration: 0.2,
        delay: 0,
      },
    },
  },
  expanded: {
    height: "auto" as const,
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
      opacity: {
        duration: 0.3,
        delay: 0.1,
      },
    },
  },
};

const buttonHoverVariants = {
  hover: {
    scale: 1.0,
    transition: {
      type: "spring" as const,
      damping: 10,
      stiffness: 400,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const SelfHealingErrorDisplay: React.FC<SelfHealingErrorDisplayProps> = ({
  payload,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showErrorCode, setShowErrorCode] = useState<{
    [key: number]: boolean;
  }>({});

  // Memoized computed values for performance
  const { isMerged, displayPayload, allPayloads } = useMemo(() => {
    if (!payload) {
      return { isMerged: false, displayPayload: null, allPayloads: [] };
    }

    const isMerged =
      (payload as MergedSelfHealingErrorPayload).type ===
      "merged_self_healing_errors";

    const displayPayload = isMerged
      ? (payload as MergedSelfHealingErrorPayload).latest
      : (payload as SelfHealingErrorPayload);

    const allPayloads = isMerged
      ? (payload as MergedSelfHealingErrorPayload).payloads
      : [payload as SelfHealingErrorPayload];

    return { isMerged, displayPayload, allPayloads };
  }, [payload]);

  const handleToggleExpand = useCallback(() => {
    if (isMerged) {
      setIsExpanded((prev) => !prev);
    }
  }, [isMerged]);

  const handleToggleErrorCode = useCallback((index: number) => {
    setShowErrorCode((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  if (!payload || !displayPayload) {
    return null;
  }

  // Optimized single error renderer with Framer Motion
  const renderSingleError = useCallback(
    (
      errorPayload: SelfHealingErrorPayload,
      index: number = 0,
      isInList = false
    ) => {
      const currentlyShowingError = showErrorCode[index] || false;
      const hasErrorMessage = !!errorPayload.error_message;

      return (
        <motion.div
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
        >
          {/* Main content area */}
          <motion.div
            className={`flex gap-3 items-center w-full ${isInList ? "justify-start" : "justify-center"}`}
            whileHover={{ scale: 0.99 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Animated circle for latest error or static number for older ones */}
            {index === 0 ? (
              <motion.div
                className="w-5 h-5 rounded-full bg-highlight/10 flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 0.95 }}
                transition={{ type: "spring", damping: 15, stiffness: 400 }}
              >
                <motion.div variants={pulseVariants} animate="animate">
                  <FaCircle scale={0.2} className="text-lg text-highlight" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 300,
                  delay: index * 0.1,
                }}
              >
                <p className="text-secondary text-xs">{index}</p>
              </motion.div>
            )}

            <div className="flex-1 min-w-0">
              {/* Feedback/Error toggle content with smooth animations */}
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {!currentlyShowingError ? (
                    // Feedback view
                    <motion.div
                      key="feedback"
                      variants={slideVariants}
                      initial={{ x: -20, opacity: 0 }}
                      animate="feedback"
                      exit="exit"
                      layout
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={handleToggleExpand}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <AnimatePresence mode="wait">
                            <motion.div
                              key="feedback"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{
                                type: "spring",
                                damping: 20,
                                stiffness: 300,
                              }}
                            >
                              <MarkdownFormat
                                text={errorPayload.feedback}
                                variant={
                                  index === 0 ? "highlight" : "secondary"
                                }
                              />
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-1 flex-shrink-0"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {/* Copy feedback button - only show when no error code exists */}
                          {!hasErrorMessage && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CopyToClipboardButton
                                  copyText={errorPayload.feedback}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy feedback</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {/* Toggle to error code button */}
                          {hasErrorMessage && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <motion.button
                                  onClick={() => handleToggleErrorCode(index)}
                                  className={`p-1.5 rounded ${
                                    index === 0
                                      ? "text-highlight/60 hover:text-highlight"
                                      : "text-secondary/60 hover:text-secondary"
                                  }`}
                                  variants={buttonHoverVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <motion.div
                                    animate={{
                                      rotate: currentlyShowingError ? 180 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <FaCode />
                                  </motion.div>
                                </motion.button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Show details</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    // Error code view
                    <motion.div
                      key="error"
                      variants={slideVariants}
                      initial={{ x: 20, opacity: 0 }}
                      animate="error"
                      exit="exit"
                      layout
                    >
                      <motion.div
                        className="bg-highlight/10 border border-highlight/20 rounded p-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          type: "spring",
                          damping: 20,
                          stiffness: 300,
                        }}
                      >
                        <motion.div
                          className="flex items-start justify-between gap-2 mb-2"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h4 className="text-xs font-semibold text-highlight flex items-center gap-1">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
                              <FaCode className="text-sm" />
                            </motion.div>
                            Self Healing Details
                          </h4>
                          <motion.div
                            className="flex items-center gap-1 flex-shrink-0"
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <CopyToClipboardButton
                              copyText={errorPayload.error_message}
                            />
                            <motion.div
                              variants={buttonHoverVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                onClick={() => handleToggleErrorCode(index)}
                                className="text-highlight hover:text-primary w-9 h-9 bg-none"
                                variant="default"
                              >
                                <motion.div
                                  animate={{
                                    rotate: currentlyShowingError ? 180 : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <IoMdCloseCircle />
                                </motion.div>
                              </Button>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                        <motion.div
                          className="text-sm text-highlight font-mono whitespace-pre-wrap break-words max-h-32 overflow-y-auto"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {errorPayload.error_message}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      );
    },
    [showErrorCode, handleToggleExpand, handleToggleErrorCode]
  );

  // Optimized content renderer with enhanced animations
  const renderContent = useCallback(() => {
    if (!isMerged) {
      return renderSingleError(displayPayload, 0);
    }

    // For merged errors, render the latest with expand/collapse functionality
    return (
      <motion.div
        className="flex flex-col w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated expandable section */}
        <motion.div
          variants={expandVariants}
          initial="collapsed"
          animate={
            isExpanded && allPayloads.length > 1 ? "expanded" : "collapsed"
          }
          className="overflow-hidden"
        >
          <motion.div className="flex flex-col gap-2 w-full pb-2">
            <AnimatePresence>
              {allPayloads
                .slice(0, -1)
                .reverse()
                .map((errorPayload, index) => (
                  <motion.div
                    key={`old-error-${index}`}
                    className="opacity-75 w-full"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 0.75, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      damping: 20,
                      stiffness: 300,
                    }}
                    whileHover={{
                      opacity: 1,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {renderSingleError(errorPayload, index + 1, true)}
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Latest error */}
        <motion.div
          className="w-full"
          layout
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {renderSingleError(displayPayload, 0)}
        </motion.div>
      </motion.div>
    );
  }, [isMerged, isExpanded, allPayloads, displayPayload, renderSingleError]);

  // Main component return with cool initial animation
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.6,
      }}
      layout
    >
      <div className="w-full">{renderContent()}</div>
    </motion.div>
  );
};

// Memoized component for performance optimization
const MemoizedSelfHealingErrorDisplay = React.memo(SelfHealingErrorDisplay);

export default MemoizedSelfHealingErrorDisplay;
