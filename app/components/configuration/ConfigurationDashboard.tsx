"use client";

import React from "react";
import { FaGear } from "react-icons/fa6";

const ConfigurationDashboard: React.FC = () => {
  return (
    <div className="flex w-[80vw] flex-col p-8 h-screen items-start justify-start outline-none">
      <div className="flex flex-col gap-1 items-start justify-start w-full">
        <div className="flex items-center justify-start gap-2">
          <FaGear size={18} />
          <p className="text-primary text-xl font-heading font-bold">
            Configuration Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationDashboard;
