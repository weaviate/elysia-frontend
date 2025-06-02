"use client";

import React, { useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { Collection } from "@/app/types/objects";
import { Button } from "@/components/ui/button";
import { Toast } from "@/app/types/objects";
import { FaCircle } from "react-icons/fa";
import { LuDatabase } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";

interface DashboardButtonProps {
  collection: Collection;
  selectCollection: (collection: Collection) => void;
  analyzeCollection: (collection: Collection) => void;
  currentToasts: Toast[];
  unprocessed: boolean;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  collection,
  selectCollection,
  analyzeCollection,
  currentToasts,
  unprocessed,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsProcessing(
      currentToasts.some((toast) => toast.collection_name === collection.name)
    );
    setProgress(
      currentToasts.find((toast) => toast.collection_name === collection.name)
        ?.progress ?? 0
    );
  }, [currentToasts, collection.name]);

  return (
    <div
      key={collection.name}
      className={`flex justify-between items-center transition-all duration-200 w-full text-primary mt-1 gap-2`}
    >
      <div
        className={`flex items-center justify-center ${unprocessed ? "bg-warning" : "bg-accent"} rounded-lg text-primary w-9 h-9 flex-shrink-0`}
      >
        {unprocessed ? (
          <IoIosWarning size={20} className="flex-shrink-0" />
        ) : (
          <LuDatabase size={20} className="flex-shrink-0" />
        )}
      </div>

      <div
        className="flex items-center justify-start gap-2 w-full hover:bg-foreground_alt p-2 rounded-lg cursor-pointer"
        onClick={() => selectCollection(collection)}
      >
        <p className="truncate w-3/5 text-sm">{collection.name}</p>
      </div>

      <div className="flex gap-5">
        {!isProcessing && collection.processed && (
          <p className="hidden md:flex gap-2 items-center justify-start text-xs">
            {collection.total} objects
          </p>
        )}
        {collection.processed ? (
          <Button
            disabled={isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              analyzeCollection(collection);
            }}
          >
            {isProcessing ? (
              <>
                <FaCircle className="pulsing hidden md:block" />
                <p>Analyzing... {progress}%</p>
              </>
            ) : (
              <p className="font-semibold text-sm">Analyze</p>
            )}
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
