import React, { useState } from "react";
import { motion } from "framer-motion";

interface MergedDisplayTabsProps {
  baseKey: string;
  tabValue: string;
  idx: number;
  tabTitle: string;
  setActiveTab: (tabValue: string) => void;
  activeTab: string;
}

const MergedDisplayTabs: React.FC<MergedDisplayTabsProps> = ({
  baseKey,
  tabValue,
  idx,
  tabTitle,
  setActiveTab,
  activeTab,
}) => {
  const [viewed, setViewed] = useState(activeTab === tabValue);

  const handleClick = () => {
    setActiveTab(tabValue);
    setViewed(true);
  };

  return (
    <div
      className="flex gap-2 hover:bg-background_alt text-sm rounded-md transition-colors flex-shrink-0 px-4 py-2 items-center cursor-pointer"
      onClick={handleClick}
      key={`${baseKey}-trigger-${idx}`}
    >
      {!viewed ? (
        <motion.div
          className="w-2 h-2 bg-primary rounded-full flex-shrink-0"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ) : (
        <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
      )}
      <button
        className={`
                  flex 
                  ${activeTab === tabValue ? "text-primary" : "text-secondary"}
                `}
      >
        {tabTitle}
      </button>
    </div>
  );
};

export default MergedDisplayTabs;
