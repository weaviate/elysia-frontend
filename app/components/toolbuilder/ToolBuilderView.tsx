import ToolBuilderSidebar from "./ToolBuilderSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ToolBuilderEditor from "./ToolBuilderEditor";

const ToolBuilderView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-row w-full h-full">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ToolBuilderSidebar />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        key="editor"
        className="w-full h-full"
        animate={{ marginLeft: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
      >
        <ToolBuilderEditor />
      </motion.div>
    </div>
  );
};

export default ToolBuilderView;
