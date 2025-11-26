import { motion } from "framer-motion";
import { useState } from "react";

interface ToolSidebarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const ToolSidebarButton = ({
  onClick,
  icon,
  label,
}: ToolSidebarButtonProps) => {
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      className={`flex flex-row items-center w-full cursor-pointer justify-start gap-3 border ${hovering ? "border-accent/50" : "border-foreground"} p-2 rounded-md`}
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
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      onClick={onClick}
    >
      {/* Icon */}
      <motion.div
        className={`flex items-center justify-center p-2 rounded-md ${hovering ? "text-accent bg-accent/10" : "text-secondary bg-secondary/10"}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 0.9, rotate: 0 }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
      >
        {icon}
      </motion.div>
      <motion.div
        className={`${hovering ? "text-accent" : "text-secondary"} transition-all duration-300 text-sm`}
      >
        <p>{label}</p>
      </motion.div>
    </motion.div>
  );
};

export default ToolSidebarButton;
