"use client";

import React from "react";
import MarkdownFormat from "../../components/MarkdownFormat";
import { IoWarningOutline } from "react-icons/io5";

interface ErrorMessageDisplayProps {
  error: string;
}

const ErrorMessageDisplay: React.FC<ErrorMessageDisplayProps> = ({ error }) => {
  return (
    <div className="w-full flex flex-col justify-start items-start ">
      <div className="max-w-3/5">
        <div className="flex flex-col justify-start items-start gap-2 chat-animation border border-error p-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <IoWarningOutline className="text-error text-lg" />
            <p className="text-error text-sm font-bold">Error</p>
          </div>
          <MarkdownFormat text={error} />
        </div>
      </div>
    </div>
  );
};

export default ErrorMessageDisplay;
