"use client";

import { TextPayload } from "@/app/types/chat";
import MarkdownFormat from "../../components/MarkdownFormat";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextDisplayProps {
  payload: TextPayload[];
}

// Animation variants for smooth expand/collapse
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

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

const TextDisplay: React.FC<TextDisplayProps> = ({ payload }) => {
  const [collapsed, setCollapsed] = useState(true);
  const triggerCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <motion.div
      className="w-full flex flex-col items-start justify-start gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      {/* Animated expandable section for older items */}
      {payload.length > 1 && (
        <motion.div
          variants={expandVariants}
          initial="collapsed"
          animate={!collapsed ? "expanded" : "collapsed"}
          className="overflow-hidden w-full"
        >
          <motion.div className="flex flex-col gap-2">
            <AnimatePresence>
              {!collapsed &&
                payload.slice(0, -1).map((item, index) => (
                  <motion.div
                    key={`${item.text}-${index}`}
                    className="flex gap-2 items-center justify-center"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.p
                      className="text-xs w-5 h-5 bg-background_alt text-secondary p-2 rounded-full items-center justify-center flex flex-shrink-0"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 300,
                        delay: index * 0.05,
                      }}
                    >
                      {index + 1}
                    </motion.p>
                    <motion.div className="flex-1 min-w-0">
                      <MarkdownFormat text={item.text} variant="secondary" />
                    </motion.div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}

      {/* Latest item - always visible */}
      {payload.length > 0 && (
        <motion.div
          className="flex w-full gap-2 items-center cursor-pointer"
          key={payload[payload.length - 1].text}
          onClick={triggerCollapse}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            delay: 0.1,
          }}
        >
          {payload.length > 1 && (
            <motion.p
              className="text-xs bg-background_alt text-secondary p-2 w-5 h-5 rounded-full items-center justify-center flex flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", damping: 15, stiffness: 400 }}
            >
              {payload.length}
            </motion.p>
          )}
          <motion.div className="flex-1 min-w-0">
            <MarkdownFormat text={payload[payload.length - 1].text} />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TextDisplay;
