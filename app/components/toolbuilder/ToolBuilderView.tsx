import ToolBuilderSidebar from "./ToolBuilderSidebar";
import { motion } from "framer-motion";
import { useState } from "react";
import ToolBuilderEditor from "./ToolBuilderEditor";

const ToolBuilderView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-row w-full h-full">
      {/* Animated sidebar container */}
      <motion.div
        className="h-full overflow-hidden shrink-0"
        initial={false}
        animate={{ 
          width: sidebarOpen ? 300 : 0,
          opacity: sidebarOpen ? 1 : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <ToolBuilderSidebar onCollapse={() => setSidebarOpen(false)} />
      </motion.div>
      {/* Editor fills remaining space and animates smoothly */}
      <motion.div 
        className="h-full flex-1 min-w-0"
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <ToolBuilderEditor 
          sidebarCollapsed={!sidebarOpen} 
          onExpandSidebar={() => setSidebarOpen(true)} 
        />
      </motion.div>
    </div>
  );
};

export default ToolBuilderView;
