"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShareNodes } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";

export interface NodeData {
  text: string;
  description?: string;
  instruction?: string;
  reasoning?: string;
  choosen?: boolean;
  originalId?: string;
}

interface NodeDetailsSidebarProps {
  isOpen: boolean;
  nodeData: NodeData | null;
  onClose: () => void;
}

const NodeDetailsSidebar: React.FC<NodeDetailsSidebarProps> = ({
  isOpen,
  nodeData,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && nodeData && (
        <>
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-end">
                <Button
                  onClick={onClose}
                  className="bg-error/10 text-error border-error border w-8 h-8"
                >
                  <IoMdClose size={20} />
                </Button>
              </div>

              {/* Node title with status indicator */}
              <div className="mt-4 flex items-center gap-3">
                <div className="bg-accent/10 text-accent border border-accent/20 p-2 rounded-md w-9 h-9 flex items-center justify-center">
                  <FaShareNodes size={16} />
                </div>
                <h3 className="text-primary truncate font-bold">
                  {nodeData.text}
                </h3>
              </div>

              {nodeData.choosen && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                    Selected Path
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-scroll h-[calc(100vh-140px)] flex flex-col gap-4">
              {nodeData.reasoning && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-alt_color_a uppercase tracking-wide">
                    Reasoning
                  </h4>
                  <div className="p-4 bg-alt_color_a/5 border border-alt_color_a/20 rounded-lg">
                    <p className="text-primary text-sm leading-relaxed whitespace-pre-wrap">
                      {nodeData.reasoning}
                    </p>
                  </div>
                </div>
              )}

              {nodeData.description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-accent uppercase tracking-wide">
                    Description
                  </h4>
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <p className="text-primary text-sm leading-relaxed whitespace-pre-wrap">
                      {nodeData.description}
                    </p>
                  </div>
                </div>
              )}

              {nodeData.instruction && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-highlight uppercase tracking-wide">
                    Instructions
                  </h4>
                  <div className="p-4 bg-highlight/5 border border-highlight/20 rounded-lg">
                    <p className="text-primary text-sm leading-relaxed whitespace-pre-wrap">
                      {nodeData.instruction}
                    </p>
                  </div>
                </div>
              )}

              {/* Additional metadata */}
              {nodeData.originalId && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-secondary uppercase tracking-wide">
                    Metadata
                  </h4>
                  <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                    <p className="text-primary text-xs font-mono">
                      ID: {nodeData.originalId}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NodeDetailsSidebar;
