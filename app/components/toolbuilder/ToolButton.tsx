import { ToolMetadata } from "@/app/types/objects";

import { FaTools } from "react-icons/fa";
import { LuTextQuote } from "react-icons/lu";
import { MdManageSearch } from "react-icons/md";
import { RiMergeCellsHorizontal } from "react-icons/ri";
import { LuFileText } from "react-icons/lu";
import { motion } from "framer-motion";
import { useState } from "react";
import { TbGitBranch } from "react-icons/tb";
import { getColor } from "./EditorNodes";
interface ToolButtonProps {
  metadata: ToolMetadata;
  is_branch: boolean;
}

export const get_icon_name = (name: string): React.ReactNode => {
  switch (name) {
    case "text_response":
      return <LuTextQuote />;
    case "query":
      return <MdManageSearch />;
    case "aggregate":
      return <RiMergeCellsHorizontal />;
    case "cited_summarize":
      return <LuFileText />;
    case "New Branch":
      return <TbGitBranch />;
  }
  return <FaTools />;
};

const ToolButton = ({ metadata, is_branch }: ToolButtonProps) => {
  const [hovering, setHovering] = useState(false);

  const get_display_name = (name: string): string => {
    const split = name.split("_");
    const capitalized = split.map(
      (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalized.join(" ");
  };

  // Handle drag start
  const onDragStart = (event: React.DragEvent) => {
    if (is_branch) {
      event.dataTransfer.setData(
        "application/reactflow",
        JSON.stringify({
          name: "New Branch",
          instruction: metadata.description,
          is_branch: is_branch,
        })
      );
    } else {
      event.dataTransfer.setData(
        "application/reactflow",
        JSON.stringify({
          name: metadata.name,
          description: metadata.description,
          is_branch: is_branch,
        })
      );
    }
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`flex flex-row items-center w-full cursor-grab justify-start gap-3 border ${hovering ? "border-" + getColor(is_branch) + "/50" : "border-foreground"} p-3 rounded-md`}
      draggable={true}
      onDragStart={onDragStart}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.div
        className="flex flex-row items-center w-full justify-start gap-3"
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
      >
        {/* Icon */}
        <motion.div
          className={`flex items-center justify-center p-2 rounded-md ${hovering ? "text-" + getColor(is_branch) + " bg-" + getColor(is_branch) + "/10" : "text-secondary bg-secondary/10"}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 0.9, rotate: 0 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
        >
          {get_icon_name(metadata.name)}
        </motion.div>
        <motion.div
          className={`${hovering ? "text-" + getColor(is_branch) : "text-secondary"} transition-all duration-300 text-sm`}
        >
          <p>{get_display_name(metadata.name)}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ToolButton;
