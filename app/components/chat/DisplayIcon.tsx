import React from "react";
import { ResultPayload } from "@/app/types/chat";
import { IoDocumentTextSharp } from "react-icons/io5";

interface DisplayIconProps {
  payload: ResultPayload[];
}

const DisplayIcon: React.FC<DisplayIconProps> = ({
  payload,
}) => {
  const type_to_icon = (type: string) => {
    switch (type) {
      case "text":
        return "💬";
      case "ticket":
        return "🎫";
      case "message":
        return "💬";
      case "conversation":
        return "💬";
      case "product":
        return "🛒";
      case "ecommerce":
        return "🛒";
      case "epic_generic":
        return "💬";
      case "boring_generic":
        return "💬";
      case "aggregation":
        return "💬";
      case "mapped":
        return "💬";
      case "document":
        return <IoDocumentTextSharp />;
      default:
        return "💬";
    }
  };

  return (
    <div className="flex items-center gap-2">
        <div key={payload[0].type + "DisplayIcon"} className="w-8 h-8 rounded-lg bg-accent text-primary items-center justify-center flex">
          {type_to_icon(payload[0].type)}
        </div>
    </div>
  );
};

export default DisplayIcon;
