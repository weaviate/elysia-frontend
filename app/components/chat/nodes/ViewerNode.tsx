"use client";

import { ToolMetadata, TreeNode } from "@/app/types/objects";
import { Handle, Position } from "@xyflow/react";
import { TbGitBranch } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useState, memo } from "react";
import { MdOutlineQuestionMark, MdExpandMore } from "react-icons/md";
import { get_icon_name } from "../../toolbuilder/ToolButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ViewerNodeData {
  label: string;
  tree_node: TreeNode;
  tool_metadata: ToolMetadata | null;
  // Traversal-specific data
  traversed: boolean;
  active: boolean; // Currently being processed
  queryIndex: number;
  treeIndex: number;
}

const getDisplayName = (name: string): string => {
  const split = name.split("_");
  const capitalized = split.map(
    (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalized.join(" ");
};

// Memoized component to prevent unnecessary re-renders
export const ViewerNode = memo(
  ({ data, id }: { data: ViewerNodeData; id: string }) => {
    const [hovering, setHovering] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);

    const { is_branch, is_root } = data.tree_node;
    const { traversed, active } = data;

    // Get description from tree_node or tool_metadata
    const description =
      data.tree_node.description || data.tool_metadata?.description || null;

    // Get instruction from tree_node (only for branches/roots)
    const instruction = data.tree_node.instruction || null;

    // Check if we have any metadata to show
    const hasMetadata = description || instruction;

    // Color logic based on traversal state
    const getNodeColor = () => {
      if (active) return "highlight";
      if (traversed) return "accent";
      return "secondary";
    };

    const getBorderColor = () => {
      if (active) return "border-highlight";
      if (traversed) return "border-accent";
      if (hovering) return "border-foreground_alt";
      return "border-foreground/30";
    };

    const getOpacity = () => {
      if (traversed || active) return "opacity-100";
      return "opacity-50";
    };

    const nodeColor = getNodeColor();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        className={`flex flex-col items-center gap-2 cursor-pointer bg-background border-2 rounded-lg p-3 w-[260px] ${getBorderColor()} ${getOpacity()} transition-all duration-300 pointer-events-auto`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => hasMetadata && setShowMetadata(!showMetadata)}
        key={id}
      >
        {/* Target handle for non-root nodes */}
        {!is_root && (
          <Handle
            type="target"
            position={Position.Top}
            className={`!w-3 !h-3 !border-2 !border-background ${
              traversed ? "!bg-accent" : "!bg-secondary/50"
            }`}
          />
        )}

        <div
          className={`flex items-center justify-between p-2 rounded-md bg-${nodeColor}/10 text-${nodeColor} gap-2 w-full transition-colors duration-300`}
        >
          <div className="flex items-center justify-start gap-2">
            <motion.div
              className={`flex items-center justify-center p-2 rounded-md text-${nodeColor} bg-${nodeColor}/10`}
              animate={{
                scale: active ? [0.9, 1.1, 0.9] : 0.9,
              }}
              transition={
                active
                  ? {
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }
                  : {}
              }
            >
              {is_branch ? (
                <TbGitBranch className="text-lg" />
              ) : (
                get_icon_name(data.tree_node.name)
              )}
            </motion.div>
            <div className="flex flex-col items-start">
              <p className="text-[8px] text-secondary uppercase font-semibold tracking-wide">
                {is_root ? "Root" : is_branch ? "Branch" : "Tool"}
              </p>
              <p
                className={`text-sm font-medium text-${nodeColor} tracking-wide`}
              >
                {getDisplayName(data.tree_node.name)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1">
            {/* Status indicator */}
            {active && (
              <motion.div
                className="w-2 h-2 rounded-full bg-highlight"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}

            {/* Expand indicator if has metadata */}
            {hasMetadata && (
              <motion.div
                animate={{ rotate: showMetadata ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-center rounded-full w-5 h-5 ${
                  showMetadata
                    ? `bg-${nodeColor} text-background`
                    : `bg-${nodeColor}/20 text-${nodeColor}`
                }`}
              >
                <MdExpandMore size={14} />
              </motion.div>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="flex items-center justify-center rounded-full w-5 h-5 text-primary bg-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdOutlineQuestionMark size={10} />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {is_root
                      ? "Root node - starting point of the decision tree"
                      : is_branch
                        ? "Decision branch - agent chooses a path based on context"
                        : "Tool node - executes a specific action"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Metadata section */}
        <AnimatePresence>
          {showMetadata && hasMetadata && (
            <motion.div
              key="metadata"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                height: { duration: 0.4 },
              }}
              className="no-wheel flex flex-col items-start justify-start gap-3 max-h-[300px] overflow-auto w-full border-t border-foreground/10 pt-2"
            >
              {/* Description */}
              {description && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className="flex flex-col items-start gap-1 w-full"
                >
                  <span className="text-[9px] text-secondary uppercase font-semibold tracking-wide">
                    Description
                  </span>
                  <span className="text-[11px] text-primary/80 leading-relaxed">
                    {description}
                  </span>
                </motion.div>
              )}

              {/* Instruction (for branches/roots) */}
              {instruction && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                  className="flex flex-col items-start gap-1 w-full"
                >
                  <span className="text-[9px] text-secondary uppercase font-semibold tracking-wide">
                    Instruction
                  </span>
                  <span className="text-[11px] text-primary/80 leading-relaxed">
                    {instruction}
                  </span>
                </motion.div>
              )}

              {/* Tree/Query index info */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                className="flex items-center gap-2 text-[10px] text-secondary pt-1 border-t border-foreground/10 w-full"
              >
                <span className="px-1.5 py-0.5 rounded bg-foreground/30">
                  Depth {data.queryIndex + 1}
                </span>
                {data.treeIndex > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-foreground/30">
                    Iteration {data.treeIndex + 1}
                  </span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Handle
          type="source"
          position={Position.Bottom}
          className={`!w-3 !h-3 !border-2 !border-background ${
            traversed ? "!bg-accent" : "!bg-secondary/50"
          }`}
        />
      </motion.div>
    );
  }
);

ViewerNode.displayName = "ViewerNode";

export const viewerNodeTypes = {
  viewerNode: ViewerNode,
};
