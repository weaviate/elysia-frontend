import { TiShoppingCart } from "react-icons/ti";
import { LuFileQuestion, LuFileText, LuList } from "react-icons/lu";
import { LuMessagesSquare } from "react-icons/lu";
import { LuTickets } from "react-icons/lu";
import { LuMessageSquare } from "react-icons/lu";
import { FaTable } from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { IconType } from "react-icons";

interface DisplayConfig {
  icon: IconType;
  bgColor: string;
  textColor: string;
  tooltip: string;
}

const displayConfigs: Record<string, DisplayConfig> = {
  ecommerce: {
    icon: TiShoppingCart,
    bgColor: "bg-highlight",
    textColor: "text-primary",
    tooltip: "Product",
  },
  conversation: {
    icon: LuMessagesSquare,
    bgColor: "bg-accent",
    textColor: "text-primary",
    tooltip: "Conversation",
  },
  message: {
    icon: LuMessageSquare,
    bgColor: "bg-accent",
    textColor: "text-primary",
    tooltip: "Message",
  },
  ticket: {
    icon: LuTickets,
    bgColor: "bg-alt_color_a",
    textColor: "text-primary",
    tooltip: "Ticket",
  },
  document: {
    icon: LuFileText,
    bgColor: "bg-alt_color_a",
    textColor: "text-primary",
    tooltip: "Document",
  },
  boring_generic: {
    icon: FaTable,
    bgColor: "bg-primary",
    textColor: "text-background",
    tooltip: "Table",
  },
  aggregation: {
    icon: FaLayerGroup,
    bgColor: "bg-alt_color_b",
    textColor: "text-background",
    tooltip: "Aggregation",
  },
};

const defaultConfig: DisplayConfig = {
  icon: LuFileQuestion,
  bgColor: "bg-background_alt",
  textColor: "text-primary",
  tooltip: "Unknown Type",
};

export const getDisplayIcon = (display_type: string) => {
  const config = displayConfigs[display_type] || defaultConfig;
  const { icon: Icon, bgColor, textColor, tooltip } = config;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex flex-row gap-2 justify-center items-center cursor-pointer ${bgColor} rounded-md p-1 h-8 w-8`}
        >
          <Icon size={18} className={textColor} />
        </div>
      </TooltipTrigger>
      <TooltipContent className={`${bgColor} ${textColor}`}>
        <p className={`font-bold text-xs`}>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
