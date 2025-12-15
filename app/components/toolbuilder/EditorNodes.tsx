import { ToolMetadata, TreeNode } from "@/app/types/objects";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { TbGitBranch } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MdOutlineQuestionMark, MdEdit } from "react-icons/md";
import { get_icon_name } from "./ToolButton";
import { IoClose } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const getColor = (is_branch: boolean) => {
  return is_branch ? "accent" : "highlight";
};

interface NodeData {
  label: string;
  tree_node: TreeNode;
  tool_metadata: ToolMetadata | null;
  isInvalid?: boolean;
  view_only: boolean;
}

const getDisplayName = (name: string): string => {
  const split = name.split("_");
  const capitalized = split.map(
    (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalized.join(" ");
};

// Common event handlers to prevent canvas interaction
const preventCanvasEvents = {
  onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
  onMouseMove: (e: React.MouseEvent) => e.stopPropagation(),
  onMouseUp: (e: React.MouseEvent) => e.stopPropagation(),
  onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
  onPointerMove: (e: React.PointerEvent) => e.stopPropagation(),
  onPointerUp: (e: React.PointerEvent) => e.stopPropagation(),
  onTouchStart: (e: React.TouchEvent) => e.stopPropagation(),
  onTouchMove: (e: React.TouchEvent) => e.stopPropagation(),
  onTouchEnd: (e: React.TouchEvent) => e.stopPropagation(),
};

export const ToolEditorNode = ({
  data,
  id,
}: {
  data: NodeData;
  id: string;
}) => {
  const cleanText = (text: string) => {
    return text.replace(/^\s+/, "").replace(/\s+/g, " ").trim();
  };

  const [hovering, setHovering] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(data.tree_node.name);
  const [description, setDescription] = useState(
    data.tree_node.description ||
      (data.tool_metadata?.description &&
      !data.tree_node.is_branch &&
      !data.tree_node.is_root
        ? cleanText(data.tool_metadata?.description || "")
        : "") ||
      ""
  );
  const [instruction, setInstruction] = useState(
    cleanText(data.tree_node.instruction || "")
  );
  const { deleteElements, updateNode } = useReactFlow();

  const { is_branch, is_root } = data.tree_node;
  const isToolNode = !is_branch && !is_root;
  const canEditName = is_branch || is_root;

  const toggleEditing = () => {
    const newEditingState = !editing;
    setEditing(newEditingState);
    updateNode(id, { draggable: !newEditingState });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    updateNode(id, {
      data: {
        ...data,
        tree_node: { ...data.tree_node, name: value },
      },
    });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    updateNode(id, {
      data: {
        ...data,
        tree_node: { ...data.tree_node, description: value.trim() },
      },
    });
  };

  const handleInstructionChange = (value: string) => {
    setInstruction(value);
    updateNode(id, {
      data: {
        ...data,
        tree_node: { ...data.tree_node, instruction: value.trim() },
      },
    });
  };

  const exitEditing = () => {
    setEditing(false);
    updateNode(id, { draggable: true });
  };

  const cancelEditing = () => {
    setName(data.tree_node.name);
    exitEditing();
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
        scale: editing ? 1 : 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      whileTap={{ scale: editing ? 1 : 0.95 }}
      className={`flex flex-col items-center gap-2 ${
        editing ? "cursor-text" : "cursor-pointer"
      } bg-background border-2 rounded-lg p-3 w-[280px] ${
        data.isInvalid
          ? "border-warning"
          : hovering
            ? `border-${getColor(is_branch)}`
            : "border-foreground"
      }`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={
        editing
          ? (e) => e.stopPropagation()
          : () => setShowMetadata(!showMetadata)
      }
      {...(editing ? preventCanvasEvents : {})}
      key={data.tree_node.id}
    >
      {!is_root && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-white !w-3 !h-3 !border-2 !border-background"
        />
      )}

      <div
        className={`flex items-center justify-between p-2 rounded-md bg-${getColor(is_branch)}/10 text-${getColor(is_branch)} gap-2 w-full`}
      >
        <div className="flex items-center justify-start gap-2">
          <motion.div
            className={`flex items-center justify-center p-2 rounded-md text-${getColor(is_branch)} bg-${getColor(is_branch)}/10`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 0.9, rotate: 0 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
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
            {editing && !data.view_only ? (
              <div
                className="nodrag w-full"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerMove={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onDragStart={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={exitEditing}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") exitEditing();
                    if (e.key === "Escape") cancelEditing();
                  }}
                  className={`nodrag text-sm font-medium text-${getColor(is_branch)} tracking-wide bg-transparent border-b border-${getColor(is_branch)} outline-none w-full`}
                  autoFocus
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseMove={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerMove={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              <p
                className={`text-sm font-medium text-${getColor(is_branch)} tracking-wide`}
              >
                {getDisplayName(name)}
              </p>
            )}
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
                <p>
                  {is_branch
                    ? "Branches are used to categorize the different uses of tools depending on its description and instruction"
                    : "Tools are used to perform specific tasks and are connected to other tools or branches."}
                </p>
              </TooltipContent>
            </Tooltip>

            {canEditName && !data.view_only && (
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
                    className={`flex ${
                      editing
                        ? `bg-${getColor(is_branch)}`
                        : `bg-${getColor(is_branch)}/10`
                    } w-5 h-5 items-center justify-center rounded-full text-primary`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEditing();
                    }}
                  >
                    <MdEdit size={10} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit name</p>
                </TooltipContent>
              </Tooltip>
            )}

            {!is_root && !data.view_only && (
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
                      deleteElements({ nodes: [{ id }] });
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

      {/* Editable metadata for branch nodes */}
      <AnimatePresence>
        {is_branch && !is_root && showMetadata && (
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
            className="no-wheel flex flex-col items-start justify-start gap-2 max-h-[200px] overflow-auto w-full"
          >
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="nodrag flex flex-col items-start gap-1 w-full"
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[8px] text-secondary uppercase font-semibold tracking-wide">
                Description
              </span>
              <textarea
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Enter description..."
                className="nodrag text-xs text-primary tracking-wide bg-transparent border border-secondary/20 rounded p-2 outline-none w-full min-h-[80px] resize-none focus:border-accent/50"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerMove={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onDragStart={(e) => e.preventDefault()}
                disabled={data.view_only}
              />
            </motion.div>

            {/* Instruction */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="nodrag flex flex-col items-start gap-1 w-full"
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[8px] text-secondary uppercase font-semibold tracking-wide">
                Instruction
              </span>
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(e.target.value)}
                placeholder="Enter instruction..."
                className="nodrag text-xs text-primary tracking-wide bg-transparent border border-secondary/20 rounded p-2 outline-none w-full min-h-[80px] resize-none focus:border-accent/50"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerMove={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onDragStart={(e) => e.preventDefault()}
                disabled={data.view_only}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Read-only metadata for root nodes */}
      <AnimatePresence>
        {is_root && showMetadata && (
          <motion.div
            key="root-metadata"
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
            {data.tree_node.description && (
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
                  {data.tree_node.description}
                </span>
              </motion.div>
            )}
            {data.tree_node.instruction && (
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
                  {data.tree_node.instruction}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editable description for tool nodes */}
      <AnimatePresence>
        {isToolNode && showMetadata && (
          <motion.div
            key="tool-node-metadata"
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
              className="nodrag flex flex-col items-start gap-1 w-full"
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[8px] text-secondary uppercase font-semibold tracking-wide">
                Description
              </span>
              <textarea
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Enter description..."
                className="nodrag text-xs text-primary tracking-wide bg-transparent border border-secondary/20 rounded p-2 outline-none w-full min-h-[80px] resize-none focus:border-accent/50"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerMove={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onDragStart={(e) => e.preventDefault()}
                disabled={data.view_only}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white !w-3 !h-3 !border-2 !border-background"
      />
    </motion.div>
  );
};

export const nodeTypes = {
  toolEditorNode: ToolEditorNode,
};
