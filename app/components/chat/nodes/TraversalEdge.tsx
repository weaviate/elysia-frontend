"use client";

import React, { memo, useState } from "react";
import {
  EdgeProps,
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { TbRefresh } from "react-icons/tb";
import { MdOutlineQuestionMark } from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";

export interface TraversalEdgeData {
  traversed: boolean;
  reasoning?: string;
  isReset?: boolean;
  isCrossQuery?: boolean;
  isFirstDecision?: boolean; // First decision edge of a query
  queryText?: string;
  treeIndex?: number;
}

const TraversalEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style = {},
    markerEnd,
  }: EdgeProps) => {
    const [expanded, setExpanded] = useState(false);

    const edgeData = data as TraversalEdgeData | undefined;
    const isTraversed = edgeData?.traversed ?? false;
    const reasoning = edgeData?.reasoning;
    const isReset = edgeData?.isReset ?? false;
    const isCrossQuery = edgeData?.isCrossQuery ?? false;
    const isFirstDecision = edgeData?.isFirstDecision ?? false;
    const queryText = edgeData?.queryText;

    const [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 16,
    });

    // Edge colors based on state
    const getEdgeColor = () => {
      if (isReset) return "hsl(var(--highlight))";
      if (isCrossQuery) return "hsl(var(--alt_color_b))"; // Same as Query
      if (isFirstDecision) return "hsl(var(--alt_color_b))";
      if (isTraversed) return "hsl(var(--accent))";
      return "hsl(var(--secondary) / 0.3)";
    };

    const edgeStyle = {
      ...style,
      strokeWidth:
        isTraversed || isReset || isCrossQuery || isFirstDecision ? 3 : 1.5,
      stroke: getEdgeColor(),
      strokeDasharray: isReset || isCrossQuery ? "8,4" : undefined,
    };

    // Determine what type of card to show
    const hasContent =
      isReset || isCrossQuery || isFirstDecision || (isTraversed && reasoning);

    // Get card styling based on type
    const getCardStyle = () => {
      if (isReset) {
        return {
          bg: "bg-highlight/10",
          border: "border-highlight/40",
          text: "text-highlight",
          icon: <TbRefresh className="text-sm" />,
          label: "Tree Reset",
        };
      }
      if (isCrossQuery) {
        return {
          bg: "bg-alt_color_b/10",
          border: "border-alt_color_b/40",
          text: "text-alt_color_b",
          icon: <BiMessageSquareDetail className="text-sm" />,
          label: "Next Query",
        };
      }
      if (isFirstDecision) {
        return {
          bg: "bg-alt_color_b/10",
          border: "border-alt_color_b/40",
          text: "text-alt_color_b",
          icon: <BiMessageSquareDetail className="text-sm" />,
          label: "Query",
        };
      }
      if (isTraversed && reasoning) {
        return {
          bg: "bg-accent/10",
          border: "border-accent/40",
          text: "text-accent",
          icon: <MdOutlineQuestionMark className="text-sm" />,
          label: "Decision",
        };
      }
      return null;
    };

    const cardStyle = getCardStyle();

    return (
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          style={edgeStyle}
          markerEnd={markerEnd}
        />

        {/* Unified edge card */}
        {hasContent && cardStyle && (
          <EdgeLabelRenderer>
            <div
              className="nodrag nopan"
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                pointerEvents: "all",
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                className={`
                  flex flex-col items-center rounded-lg overflow-hidden
                  ${cardStyle.bg} ${cardStyle.border} border-2
                  shadow-lg backdrop-blur-sm
                  cursor-pointer select-none
                `}
                onClick={() => setExpanded(!expanded)}
              >
                {/* Compact header */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 ${cardStyle.text}`}
                >
                  {cardStyle.icon}
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {cardStyle.label}
                  </span>
                  {(reasoning || queryText) && (
                    <motion.span
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[10px] ml-1"
                    >
                      ▼
                    </motion.span>
                  )}
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expanded && (reasoning || queryText) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full overflow-hidden"
                    >
                      <div className="px-3 pb-2 pt-1 max-w-[300px] border-t border-foreground/10">
                        {/* Query text for first decision or cross-query */}
                        {(isFirstDecision || isCrossQuery) && queryText && (
                          <div className={reasoning ? "mb-2" : ""}>
                            <p className="text-[9px] uppercase tracking-wide text-secondary font-semibold mb-0.5">
                              User Query
                            </p>
                            <p className="text-xs text-primary leading-relaxed italic">
                              "{queryText}"
                            </p>
                          </div>
                        )}

                        {/* Reasoning text */}
                        {reasoning && (
                          <div>
                            <p className="text-[9px] uppercase tracking-wide text-secondary font-semibold mb-0.5">
                              Reasoning
                            </p>
                            <p className="text-[11px] text-primary/90 leading-relaxed">
                              {reasoning}
                            </p>
                          </div>
                        )}

                        {/* Reset explanation */}
                        {isReset && !reasoning && (
                          <p className="text-[11px] text-primary/90 leading-relaxed">
                            The agent is restarting the decision tree to try a
                            different approach.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  }
);

TraversalEdge.displayName = "TraversalEdge";

export const traversalEdgeTypes = {
  traversalEdge: TraversalEdge,
};

export default TraversalEdge;
