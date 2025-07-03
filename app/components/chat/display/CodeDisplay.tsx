"use client";

import { ResultPayload } from "@/app/types/chat";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect } from "react";
import { IoIosCode } from "react-icons/io";
import { Button } from "@/components/ui/button";
import CopyToClipboardButton from "@/app/components/navigation/CopyButton";
import { useRouter } from "next/navigation";
import { GoDatabase } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import DisplayIcon from "../DisplayIcon";

interface CodeDisplayProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  merged?: boolean;
  payload: ResultPayload[];
  handleViewChange: (
    view: "chat" | "code" | "result",
    payload: ResultPayload[] | null,
  ) => void;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  payload,
  merged,
  handleViewChange,
}) => {
  if (!payload) return null;

  return (
    <div className={`flex flex-row items-center`}>
      <div className="flex flex-row gap-2 items-center">
        <DisplayIcon payload={payload} />
        <Button
          variant={"default"}
          className="text-secondary w-9 h-9"
          onClick={() => {
            handleViewChange("code", payload);
          }}
        >
          <GoDatabase size={12} className="text-primary" />
        </Button>
        {!merged && (
          <div className="text-primary text-sm flex items-center justify-center rounded-md">
            {payload[0].metadata.collection_name}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeDisplay;
