"use client";

import React, { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { MdCheck } from "react-icons/md";
import { Button } from "@/components/ui/button";

interface ErrorMessageDisplayProps {
  error: string;
}

const ErrorMessageDisplay: React.FC<ErrorMessageDisplayProps> = ({ error }) => {

  const [copied, setCopied] = useState(false);  

  const copyError = () => {
    navigator.clipboard.writeText(error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="w-full flex flex-col justify-start items-start ">
      <div className="w-full">
        <div className="flex flex-col justify-start items-start gap-2 chat-animation border border-error p-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <IoWarningOutline className="text-error text-lg" />
            <p className="text-error text-sm font-bold">Error</p>
          </div>
          <div className="flex gap-2 items-center w-full justify-between">
            <p className="text-sm text-error"> Something went wrong! You can copy the error message and share it with the support team.</p>
            <Button onClick={copyError} variant={"cancel"} className={`hover:text-primary w-8 h-8 ${copied ? "text-accent" : "text-error"}`}>
              {copied ? (
                <MdCheck className={`text-lg text-accent`} />
              ) : (
                <MdContentCopy className={`text-lg text-error`} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessageDisplay;
