import ToolBuilderSidebar from "./ToolBuilderSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ToolBuilderEditor from "./ToolBuilderEditor";

const ToolBuilderView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-row w-full h-full">
      <AnimatePresence>
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: sidebarOpen ? 0 : -100 }}
          exit={{ x: -100 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <ToolBuilderSidebar />
        </motion.div>
        <motion.div className="w-full h-full ">
          <ToolBuilderEditor />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ToolBuilderView;
