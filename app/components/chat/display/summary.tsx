"use client";

import { SummaryPayload } from "@/app/types/chat";
import MarkdownFormat from "./MarkdownFormat";
import CopyToClipboardButton from "@/app/components/navigation/CopyButton";

interface SummaryDisplayProps {
  payload: SummaryPayload[];
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ payload }) => {
  const summaryText = payload
    .map((text) => `${text.title}\n${text.text}`)
    .join("\n\n");

  return (
    <div className="w-full mt-5 flex chat-animation flex-col justify-start items-start bg-gradient-to-br from-foreground_alt to-background_alt p-4 rounded-lg shadow-lg relative">
      {payload.map((text, idx) => (
        <div key={idx} className="text-sm text-white flex flex-col gap-1">
          <p className="font-bold font-heading text-lg text-white">
            {text.title}
          </p>
          <MarkdownFormat text={text.text} />
        </div>
      ))}
      <div className="absolute bottom-2 right-2">
        <CopyToClipboardButton copyText={summaryText} />
      </div>
    </div>
  );
};

export default SummaryDisplay;
