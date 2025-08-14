import React from "react";
import { Button } from "@/components/ui/button";
import { FaTable } from "react-icons/fa6";
import { RiFilePaperLine } from "react-icons/ri";
import { LuSettings2 } from "react-icons/lu";
import { motion } from "framer-motion";

type ViewType = "table" | "metadata" | "configuration";

interface ViewToggleMenuProps {
  view: ViewType;
  setView: (view: ViewType) => void;
  processed?: boolean;
}

const ViewToggleMenu: React.FC<ViewToggleMenuProps> = ({
  view,
  setView,
  processed,
}) => {
  // Animation variants for the buttons
  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-row flex-wrap gap-1 w-full justify-end items-center rounded-md bg-background mb-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={buttonVariants}>
        <Button
          onClick={() => setView("table")}
          className={`flex flex-1 border ${view === "table" ? "bg-accent/10 border-accent text-accent hover:bg-accent/20" : "border-foreground bg-transparent"}`}
        >
          <FaTable
            className={`${view === "table" ? "text-accent" : "text-secondary"}`}
          />
          <p
            className={`${view === "table" ? "text-accent" : "text-secondary"}`}
          >
            Table
          </p>
        </Button>
      </motion.div>
      <motion.div variants={buttonVariants}>
        <Button
          onClick={() => setView("metadata")}
          disabled={!processed}
          className={`flex flex-1 border ${view === "metadata" ? "bg-highlight/10 border-highlight text-highlight hover:bg-highlight/20" : "border-foreground bg-transparent"}`}
        >
          <RiFilePaperLine
            className={`${view === "metadata" ? "text-highlight" : "text-secondary"}`}
          />
          <p
            className={`${view === "metadata" ? "text-highlight" : "text-secondary"}`}
          >
            Metadata
          </p>
        </Button>
      </motion.div>
      <motion.div variants={buttonVariants}>
        <Button
          onClick={() => setView("configuration")}
          disabled={!processed}
          className={`flex flex-1 border ${view === "configuration" ? "bg-alt_color_a/10 border-alt_color_a text-alt_color_a hover:bg-alt_color_a/20" : "border-foreground bg-transparent hover:bg-background_alt "}`}
        >
          <LuSettings2
            className={`${view === "configuration" ? "text-alt_color_a" : "text-secondary"}`}
          />
          <p
            className={`${view === "configuration" ? "text-alt_color_a" : "text-secondary"}`}
          >
            Configuration
          </p>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ViewToggleMenu;
