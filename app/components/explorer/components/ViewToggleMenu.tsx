import React from "react";
import { Button } from "@/components/ui/button";
import { FaTable } from "react-icons/fa6";
import { RiFilePaperLine } from "react-icons/ri";
import { LuSettings2 } from "react-icons/lu";

type ViewType = "table" | "metadata" | "configuration";

interface ViewToggleMenuProps {
  view: ViewType;
  setView: (view: ViewType) => void;
  processed?: boolean;
}

const ViewToggleMenu: React.FC<ViewToggleMenuProps> = ({
  view,
  setView,
  processed,
}) => (
  <div className="flex flex-row flex-wrap gap-1 w-full justify-end items-center rounded-md bg-background mb-2">
    <Button
      variant={view === "table" ? "default" : "ghost"}
      onClick={() => setView("table")}
      className="flex flex-1"
    >
      <FaTable className="text-accent" />
      Table
    </Button>
    <Button
      variant={view === "metadata" ? "default" : "ghost"}
      onClick={() => setView("metadata")}
      disabled={!processed}
      className={`flex flex-1`}
    >
      <RiFilePaperLine className="text-highlight" />
      Metadata
    </Button>
    <Button
      variant={view === "configuration" ? "default" : "ghost"}
      onClick={() => setView("configuration")}
      disabled={!processed}
      className="flex flex-1"
    >
      <LuSettings2 className="text-alt_color_a" />
      Configuration
    </Button>
  </div>
);

export default ViewToggleMenu;
