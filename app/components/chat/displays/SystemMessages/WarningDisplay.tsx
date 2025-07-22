"use client";

import React from "react";
import MarkdownFormat from "../../components/MarkdownFormat";
import { IoWarningOutline } from "react-icons/io5";

interface WarningDisplayProps {
  warning: string;
}

const WarningDisplay: React.FC<WarningDisplayProps> = ({ warning }) => {
  return (
    <div className="w-full flex flex-col justify-start items-start ">
      <div className="flex flex-col justify-start items-start gap-2 chat-animation border border-warning p-4 rounded-lg">
        <div className="flex gap-2 items-center">
          <IoWarningOutline className="text-warning text-lg" />
          <p className="text-warning text-sm font-bold">Warning</p>
        </div>
        <MarkdownFormat text={warning} />
      </div>
    </div>
  );
};

export default WarningDisplay;
