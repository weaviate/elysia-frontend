import { BranchInfo, ToolItem, ToolMetadata } from "@/app/types/objects";
import { Handle, Position } from "@xyflow/react";
import { TbGitBranch } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MdOutlineQuestionMark } from "react-icons/md";
import { get_icon_name } from "./ToolButton";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NodeData {
  label: string;
  branch_info: BranchInfo | null;
  tool_info: ToolItem;
  tool_metadata: ToolMetadata | null;
  delete_node: (tool_item: ToolItem) => void;
  duplicate_node: (tool_item: ToolItem) => void;
}

const getDisplayName = (name: string): string => {
  const split = name.split("_");
  const capitalized = split.map(
    (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalized.join(" ");
};

// Branch Node Component
export const ToolEditorNode = ({ data }: { data: NodeData }) => {
  const [hovering, setHovering] = useState(false);

  const [showMetadata, setShowMetadata] = useState(false);

  const triggerShowMetadata = () => {
    setShowMetadata((prev) => !prev);
  };

  const getColor = (tool_info: ToolItem) => {
    if (tool_info.is_branch) {
      return "accent";
    }
    return "highlight";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center gap-2 cursor-pointer bg-background border-2 rounded-lg p-3 w-[280px] ${hovering ? "border-" + getColor(data.tool_info) : "border-foreground"}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={triggerShowMetadata}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={
          "!bg-" +
          getColor(data.tool_info) +
          " !w-3 !h-3 !border-2 !border-background"
        }
      />

      <div
        className={`flex items-center justify-between p-2 rounded-md bg-${getColor(data.tool_info)}/10 text-${getColor(data.tool_info)} gap-2 w-full`}
      >
        <div className="flex items-center justify-start gap-2">
          <motion.div
            className={`flex items-center justify-center p-2 rounded-md text-${getColor(data.tool_info)} bg-${getColor(data.tool_info)}/10`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 0.9, rotate: 0 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            {data.tool_info.is_branch ? (
              <TbGitBranch className="text-lg" />
            ) : (
              get_icon_name(data.tool_info.name)
            )}
          </motion.div>
          <div className="flex flex-col items-start">
            <p
              className={`text-[8px] text-secondary uppercase font-semibold tracking-wide`}
            >
              {data.tool_info.is_branch ? "Branch" : "Tool"}
            </p>
            <p
              className={`text-sm font-medium text-${getColor(data.tool_info)} tracking-wide`}
            >
              {getDisplayName(data.label)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 0.9, rotate: 0 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                  className="flex items-center justify-center rounded-full w-5 h-5 text-primary bg-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MdOutlineQuestionMark size={10} />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                {data.tool_info.is_branch ? (
                  <p>
                    Branches are used to categorize the different uses of tools
                    depending on its description and instruction{" "}
                  </p>
                ) : (
                  <p>
                    Tools are used to perform specific tasks and are connected
                    to other tools or branches.
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
            {!(
              data.tool_info.is_branch && data.tool_info.from_branch == ""
            ) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 0.9, rotate: 0 }}
                    transition={{
                      delay: 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      },
                    }}
                    className={`flex w-5 h-5 items-center justify-center bg-${getColor(data.tool_info)}/10 rounded-full text-${getColor(data.tool_info)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      data.duplicate_node(data.tool_info);
                    }}
                  >
                    <MdOutlineContentCopy size={10} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicate node</p>
                </TooltipContent>
              </Tooltip>
            )}

            {!(
              data.tool_info.is_branch && data.tool_info.from_branch == ""
            ) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 0.9, rotate: 0 }}
                    transition={{
                      delay: 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      },
                    }}
                    className="flex w-5 h-5 items-center justify-center bg-error rounded-full text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      data.delete_node(data.tool_info);
                    }}
                  >
                    <IoClose size={10} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete node</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>

      <AnimatePresence>
        {data.branch_info && showMetadata && (
          <motion.div
            key="branch-metadata"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              height: { duration: 0.4 },
            }}
            className="no-wheel flex flex-col items-start justify-start gap-1 max-h-[200px] overflow-auto w-full"
          >
            {data.branch_info.description && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="flex flex-col items-start gap-1"
              >
                <span className="text-[8px] text-secondary uppercase font-semibold tracking-wide">
                  Description
                </span>
                <span className="text-xs text-primary tracking-wide">
                  {data.branch_info.description}
                </span>
              </motion.div>
            )}
            {data.branch_info.instruction && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="flex flex-col items-start gap-1"
              >
                <span className="text-[8px] text-secondary uppercase font-semibold tracking-wide">
                  Instruction
                </span>
                <span className="text-xs text-primary tracking-wide">
                  {data.branch_info.instruction}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {data.tool_metadata && showMetadata && (
          <motion.div
            key="tool-metadata"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              height: { duration: 0.4 },
            }}
            className="no-wheel flex flex-col items-start justify-start gap-1 max-h-[200px] overflow-auto w-full"
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="flex flex-col items-start gap-1"
            >
              <span className="text-[8px] text-secondary uppercase font-semibold tracking-wide">
                Description
              </span>
              <span className="text-xs text-primary tracking-wide">
                {data.tool_metadata.description}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Handle
        type="source"
        position={Position.Bottom}
        className={
          "!bg-" +
          getColor(data.tool_info) +
          " !w-3 !h-3 !border-2 !border-background"
        }
      />
    </motion.div>
  );
};

export const nodeTypes = {
  toolEditorNode: ToolEditorNode,
};
