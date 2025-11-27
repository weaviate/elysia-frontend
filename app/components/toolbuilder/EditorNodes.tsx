import { ToolMetadata, TreeNode } from "@/app/types/objects";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { TbGitBranch } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  if (is_branch) {
    return "accent";
  }
  return "highlight";
};

interface NodeData {
  label: string;
  tree_node: TreeNode;
  tool_metadata: ToolMetadata | null;
}

const getDisplayName = (name: string): string => {
  const split = name.split("_");
  const capitalized = split.map(
    (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalized.join(" ");
};

// Branch Node Component
export const ToolEditorNode = ({
  data,
  id,
}: {
  data: NodeData;
  id: string;
}) => {
  const [hovering, setHovering] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(data.tree_node.name);
  const [description, setDescription] = useState(
    data.tree_node.description || ""
  );
  const [instruction, setInstruction] = useState(
    data.tree_node.instruction || ""
  );
  const { deleteElements, updateNode } = useReactFlow();

  const triggerShowMetadata = () => {
    setShowMetadata((prev) => !prev);
  };

  // Update node draggable property when editing state changes
  const toggleEditing = () => {
    const newEditingState = !editing;
    setEditing(newEditingState);

    // Update the node's draggable property
    updateNode(id, {
      draggable: !newEditingState, // Disable dragging when editing
    });
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
        scale: editing ? 1 : 1.05, // Disable hover scale when editing
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      whileTap={{ scale: editing ? 1 : 0.95 }} // Disable tap scale when editing
      className={`flex flex-col items-center gap-2 ${editing ? "cursor-text nopan" : "cursor-pointer"} bg-background border-2 rounded-lg p-3 w-[280px] ${hovering ? "border-" + getColor(data.tree_node.is_branch) : "border-foreground"}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={editing ? (e) => e.stopPropagation() : triggerShowMetadata} // Prevent clicks when editing
      onMouseDown={
        editing
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
      onMouseMove={
        editing
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
      onMouseUp={
        editing
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
      onPointerDown={
        editing
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
      onPointerMove={
        editing
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
      onPointerUp={
        editing
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
      onTouchStart={
        editing
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
      onTouchMove={
        editing
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
      onTouchEnd={
        editing
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
            }
          : undefined
      }
      onDragStart={editing ? (e) => e.preventDefault() : undefined}
      key={data.tree_node.id}
    >
      {!data.tree_node.is_root && (
        <Handle
          type="target"
          position={Position.Top}
          className={`!bg-white !w-3 !h-3 !border-2 !border-background`}
        />
      )}

      <div
        className={`flex items-center justify-between p-2 rounded-md bg-${getColor(data.tree_node.is_branch)}/10 text-${getColor(data.tree_node.is_branch)} gap-2 w-full`}
      >
        <div className="flex items-center justify-start gap-2">
          <motion.div
            className={`flex items-center justify-center p-2 rounded-md text-${getColor(data.tree_node.is_branch)} bg-${getColor(data.tree_node.is_branch)}/10`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 0.9, rotate: 0 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            {data.tree_node.is_branch ? (
              <TbGitBranch className="text-lg" />
            ) : (
              get_icon_name(data.tree_node.name)
            )}
          </motion.div>
          <div className="flex flex-col items-start">
            <p
              className={`text-[8px] text-secondary uppercase font-semibold tracking-wide`}
            >
              {data.tree_node.is_root
                ? "Root"
                : data.tree_node.is_branch
                  ? "Branch"
                  : "Tool"}
            </p>
            {editing ? (
              <div
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerMove={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onDragStart={(e) => e.preventDefault()}
                onClick={(e) => e.stopPropagation()}
                className="nodrag w-full"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => {
                    setEditing(false);
                    updateNode(id, { draggable: true }); // Re-enable dragging
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setEditing(false);
                      updateNode(id, { draggable: true }); // Re-enable dragging
                    }
                    if (e.key === "Escape") {
                      setName(data.tree_node.name);
                      setEditing(false);
                      updateNode(id, { draggable: true }); // Re-enable dragging
                    }
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseMove={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerMove={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  className={`nodrag text-sm font-medium text-${getColor(data.tree_node.is_branch)} tracking-wide bg-transparent border-b border-${getColor(data.tree_node.is_branch)} outline-none w-full`}
                  autoFocus
                />
              </div>
            ) : (
              <p
                className={`text-sm font-medium text-${getColor(data.tree_node.is_branch)} tracking-wide`}
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
                {data.tree_node.is_branch ? (
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
                  className={`flex ${editing ? "bg-" + getColor(data.tree_node.is_branch) : "bg-" + getColor(data.tree_node.is_branch) + "/10"} w-5 h-5 items-center justify-center rounded-full text-primary`}
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
            {!data.tree_node.is_root && (
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

      <AnimatePresence>
        {data.tree_node.is_branch &&
          !data.tree_node.is_root &&
          showMetadata && (
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
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="nodrag flex flex-col items-start gap-1 w-full"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => e.stopPropagation()}
                onDragStart={(e) => e.preventDefault()}
              >
                <span className="text-[8px] text-secondary uppercase font-semibold tracking-wide">
                  Description
                </span>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    // Update node data immediately
                    updateNode(id, {
                      data: {
                        ...data,
                        tree_node: {
                          ...data.tree_node,
                          description: e.target.value,
                        },
                      },
                    });
                  }}
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
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="nodrag flex flex-col items-start gap-1 w-full"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => e.stopPropagation()}
                onDragStart={(e) => e.preventDefault()}
              >
                <span className="text-[8px] text-secondary uppercase font-semibold tracking-wide">
                  Instruction
                </span>
                <textarea
                  value={instruction}
                  onChange={(e) => {
                    setInstruction(e.target.value);
                    // Update node data immediately
                    updateNode(id, {
                      data: {
                        ...data,
                        tree_node: {
                          ...data.tree_node,
                          instruction: e.target.value,
                        },
                      },
                    });
                  }}
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
                />
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      <AnimatePresence>
        {data.tree_node.is_root && showMetadata && (
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
        className={`!bg-white !w-3 !h-3 !border-2 !border-background`}
      />
    </motion.div>
  );
};

export const nodeTypes = {
  toolEditorNode: ToolEditorNode,
};
