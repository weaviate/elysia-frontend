"use client";

import React from "react";
import { IoIosWarning } from "react-icons/io";
import { Collection } from "@/app/types/objects";
import { Button } from "@/components/ui/button";

interface DashboardButtonProps {
  collection: Collection;
  selectCollection: (collection: Collection) => void;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  collection,
  selectCollection,
}) => {
  return (
    <div
      key={collection.name}
      onClick={() => selectCollection(collection)}
      className={`flex cursor-pointer border rounded-lg justify-between items-center gap-2 p-4 transition-all duration-300 w-full hover:bg-foreground_alt bg-foreground text-primary hover:text-primary border-transparent hover:border-secondary`}
    >
      <p className="truncate w-3/5 font-bold">{collection.name}</p>
      <div className="flex gap-5">
        {collection.processed ? (
          <p className="flex gap-2 items-center justify-start text-xs">
            {collection.total} objects
          </p>
        ) : (
          <p className="flex gap-2 items-center justify-start text-xs text-warning">
            <IoIosWarning />
            Not analyzed / {collection.total} objects
          </p>
        )}
        {collection.processed ? null : (
          <Button onClick={(e) => e.stopPropagation()}>
            <p>Analyze</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardButton;
