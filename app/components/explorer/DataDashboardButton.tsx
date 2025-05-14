"use client";

import React, { useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { Collection } from "@/app/types/objects";
import { Button } from "@/components/ui/button";
import { Toast } from "@/app/types/objects";

interface DashboardButtonProps {
  collection: Collection;
  selectCollection: (collection: Collection) => void;
  analyzeCollection: (collection: Collection) => void;
  currentToasts: Toast[];
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  collection,
  selectCollection,
  analyzeCollection,
  currentToasts,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsProcessing(
      currentToasts.some((toast) => toast.collection_name === collection.name),
    );
    setProgress(
      currentToasts.find((toast) => toast.collection_name === collection.name)
        ?.progress ?? 0,
    );
  }, [currentToasts, collection.name]);

  return (
    <div
      key={collection.name}
      onClick={() => selectCollection(collection)}
      className={`flex cursor-pointer border rounded-lg justify-between items-center gap-2 p-4 transition-all duration-300 w-full hover:bg-foreground_alt bg-foreground text-primary hover:text-primary border-transparent hover:border-secondary`}
    >
      <p className="truncate w-3/5 font-bold">{collection.name}</p>
      <div className="flex gap-5">
        {!isProcessing && collection.processed ? (
          <p className="flex gap-2 items-center justify-start text-xs">
            {collection.total} objects
          </p>
        ) : !isProcessing && !collection.processed ? (
          <p className="flex gap-2 items-center justify-start text-xs text-warning">
            <IoIosWarning />
            Not analyzed
          </p>
        ) : null}
        {collection.processed ? (
          <Button
            disabled={isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              analyzeCollection(collection);
            }}
          >
            {isProcessing ? <p>Analyzing... {progress}%</p> : <p>Re-Analyze</p>}
          </Button>
        ) : (
          <Button
            disabled={isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              analyzeCollection(collection);
            }}
          >
            {isProcessing ? <p>Analyzing... {progress}%</p> : <p>Analyze</p>}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardButton;
