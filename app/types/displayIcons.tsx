import { TiShoppingCart } from "react-icons/ti";
import { LuFileQuestion } from "react-icons/lu";

export const getDisplayIcon = (display_type: string) => {
  switch (display_type) {
    case "ecommerce":
      return (
        <div className="flex flex-row gap-2 justify-center items-center bg-highlight rounded-md p-1 h-8 w-8">
          <TiShoppingCart size={18} className="text-primary" />
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
