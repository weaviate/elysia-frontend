"use client";

import React, { useState } from "react";
import MarkdownFormat from "../../components/MarkdownFormat";
import { SelfHealingErrorPayload } from "@/app/types/chat";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaCircle } from "react-icons/fa";

interface SelfHealingErrorDisplayProps {
  payload: SelfHealingErrorPayload;
}

const SelfHealingErrorDisplay: React.FC<SelfHealingErrorDisplayProps> = ({
  payload,
}) => {
  const [copied, setCopied] = useState(false);

  if (!payload) {
    return null;
  }

  const handleCopyToClipboard = async () => {
    try {
      // Copy feedback if error_message is empty, otherwise copy error_message
      const textToCopy = !payload.error_message
        ? payload.feedback
        : payload.error_message;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Render the main content
  const mainContent = (
    <div className="flex gap-2 items-center justify-center fade-in">
      <div className="w-5 h-5 rounded-full bg-highlight/10 flex items-center justify-center">
        <FaCircle scale={0.2} className="text-lg pulsing_color" />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer" onDoubleClick={handleCopyToClipboard}>
            <MarkdownFormat
              text={copied ? "Copied!" : payload.feedback}
              variant="highlight"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {copied
              ? "Copied to clipboard!"
              : `Double click to copy ${!payload.error_message ? "feedback" : "details"}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  // If no error message, render without hover card
  if (!payload.error_message) {
    return mainContent;
  }

  // If there's an error message, render with hover card
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{mainContent}</HoverCardTrigger>
      <HoverCardContent className="w-[20rem] p-2">
        <div className="flex flex-col gap-2 p-2 bg-highlight/10 rounded-md">
          <p className="font-bold text-highlight">Details</p>
          <p className="text-sm text-highlight">{payload.error_message}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SelfHealingErrorDisplay;
