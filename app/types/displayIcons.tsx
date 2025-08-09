import { TiShoppingCart } from "react-icons/ti";
import { LuFileQuestion, LuFileText } from "react-icons/lu";
import { LuMessagesSquare } from "react-icons/lu";
import { LuTickets } from "react-icons/lu";
import { LuMessageSquare } from "react-icons/lu";
import { FaTable } from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { IconType } from "react-icons";
import { FaChartBar } from "react-icons/fa";

interface DisplayConfig {
  icon: IconType;
  bgColor: string;
  textColor: string;
  tooltip: string;
}

const displayConfigs: Record<string, DisplayConfig> = {
  ecommerce: {
    icon: TiShoppingCart,
    bgColor: "bg-highlight/10",
    textColor: "text-highlight",
    tooltip: "Product",
  },
  product: {
    icon: TiShoppingCart,
    bgColor: "bg-highlight/10",
    textColor: "text-highlight",
    tooltip: "Product",
  },
  conversation: {
    icon: LuMessagesSquare,
    bgColor: "bg-accent/10",
    textColor: "text-accent",
    tooltip: "Conversation",
  },
  message: {
    icon: LuMessageSquare,
    bgColor: "bg-accent/10",
    textColor: "text-accent",
    tooltip: "Message",
  },
  ticket: {
    icon: LuTickets,
    bgColor: "bg-alt_color_a/10",
    textColor: "text-alt_color_a",
    tooltip: "Ticket",
  },
  document: {
    icon: LuFileText,
    bgColor: "bg-alt_color_a/10",
    textColor: "text-alt_color_a",
    tooltip: "Document",
  },
  table: {
    icon: FaTable,
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    tooltip: "Table",
  },
  aggregation: {
    icon: FaLayerGroup,
    bgColor: "bg-alt_color_b/10",
    textColor: "text-alt_color_b",
    tooltip: "Aggregation",
  },
  chart: {
    icon: FaChartBar,
    bgColor: "bg-alt_color_b/10",
    textColor: "text-alt_color_b",
    tooltip: "Chart",
  },
};

const defaultConfig: DisplayConfig = {
  icon: LuFileQuestion,
  bgColor: "bg-background_alt/10",
  textColor: "text-secondary",
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
