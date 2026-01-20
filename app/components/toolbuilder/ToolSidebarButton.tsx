import { motion } from "framer-motion";
import { useState } from "react";

interface ToolSidebarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

const ToolSidebarButton = ({
  onClick,
  icon,
  label,
  disabled = false,
}: ToolSidebarButtonProps) => {
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      className={`flex flex-row items-center w-full justify-start gap-3 border p-2 rounded-md ${
        disabled
          ? "cursor-not-allowed opacity-50 border-foreground/50"
          : `cursor-pointer ${hovering ? "border-accent/50" : "border-foreground"}`
      }`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: disabled ? 0.5 : 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }
      }
      whileTap={disabled ? {} : { scale: 0.95 }}
      onHoverStart={() => !disabled && setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      onClick={() => !disabled && onClick()}
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
