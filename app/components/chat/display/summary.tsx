"use client";

import { SummaryPayload } from "@/app/components/types";
import MarkdownMessageDisplay from "./markdown";

interface SummaryDisplayProps {
  payload: SummaryPayload[];
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ payload }) => {
  return (
    <div className="w-full mt-5 flex chat-animation flex-col justify-start items-start bg-background_alt p-4 rounded-lg border border-secondary">
      {payload.map((text, idx) => (
        <div key={idx} className="text-sm text-white flex flex-col gap-1">
          <p className="font-bold font-heading text-lg text-white">
            {text.title}
          </p>
          <MarkdownMessageDisplay text={text.text} />
        </div>
      ))}
    </div>
  );
};

export default SummaryDisplay;
