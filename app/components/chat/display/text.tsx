"use client";

import { TextPayload } from "@/app/types/chat";
import MarkdownFormat from "./MarkdownFormat";
import { useState } from "react";

interface TextDisplayProps {
  payload: TextPayload[];
}

const TextDisplay: React.FC<TextDisplayProps> = ({ payload }) => {
  const [collapsed, setCollapsed] = useState(true);
  const triggerCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col items-start justify-start gap-3">
      {/* Show merged text for all except last item */}
      {payload.length > 1 && !collapsed && (
        <div className="flex flex-col gap-2">
          {payload.slice(0, -1).map((item, index) => (
            <div
              key={`${item.text}-${index}`}
              className="flex gap-2 items-center justify-center fade-in"
            >
              <p
                key={`${item.text}-${index}`}
                className="text-xs w-5 h-5 bg-background_alt text-secondary p-2 rounded-full items-center justify-center flex"
              >
                {index + 1}
              </p>
              <MarkdownFormat text={item.text} variant="secondary" />
            </div>
          ))}
        </div>
      )}
      {/* Show last item separately */}
      {payload.length > 0 && (
        <div
          className="fade-in flex w-full gap-2 items-center cursor-pointer"
          key={payload[payload.length - 1].text}
          onClick={triggerCollapse}
        >
          {payload.length > 1 && (
            <p className="text-xs bg-background_alt text-secondary p-2 w-5 h-5 rounded-full items-center justify-center flex">
              {payload.length}
            </p>
          )}
          <MarkdownFormat text={payload[payload.length - 1].text} />
        </div>
      )}
    </div>
  );
};

export default TextDisplay;
