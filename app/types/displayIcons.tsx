import { TiShoppingCart } from "react-icons/ti";
import { LuFileQuestion, LuFileText, LuList } from "react-icons/lu";
import { LuMessagesSquare } from "react-icons/lu";
import { LuTickets } from "react-icons/lu";
import { LuMessageSquare } from "react-icons/lu";
import { FaTable } from "react-icons/fa";

export const getDisplayIcon = (display_type: string) => {
  switch (display_type) {
    case "ecommerce":
      return (
        <div className="flex flex-row gap-2 justify-center items-center bg-highlight rounded-md p-1 h-8 w-8">
          <TiShoppingCart size={18} className="text-primary" />
        </div>
      );
    case "conversation":
      return (
        <div className="flex flex-row gap-2 justify-center items-center bg-accent rounded-md p-1 h-8 w-8">
          <LuMessagesSquare size={18} className="text-primary" />
        </div>
      );
    case "message":
      return (
        <div className="flex flex-row gap-2 justify-center items-center bg-accent rounded-md p-1 h-8 w-8">
          <LuMessageSquare size={18} className="text-primary" />
        </div>
      );
    case "ticket":
      return (
        <div className="flex flex-row gap-2 justify-center items-center bg-alt_color_a rounded-md p-1 h-8 w-8">
          <LuTickets size={18} className="text-primary" />
        </div>
      );
    case "document":
      return (
        <div className="flex flex-row gap-2 justify-center items-center bg-alt_color_a rounded-md p-1 h-8 w-8">
          <LuFileText size={18} className="text-primary" />
        </div>
      );
    case "boring_generic":
      return (
        <div className="flex flex-row gap-2 justify-center items-center bg-primary rounded-md p-1 h-8 w-8">
          <FaTable size={18} className="text-background" />
        </div>
      );
    default:
      return (
        <div className="flex flex-row gap-2 justify-center items-center bg-background_alt rounded-md p-1 h-8 w-8">
          <LuFileQuestion size={18} className="text-primary" />
        </div>
      );
  }
};
