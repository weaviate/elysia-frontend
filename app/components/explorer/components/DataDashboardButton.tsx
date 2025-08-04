"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { GoTrash } from "react-icons/go";
import { IoIosWarning } from "react-icons/io";
import { PiMagicWandFill } from "react-icons/pi";
import { SlOptionsVertical } from "react-icons/sl";

import { Collection, Toast } from "@/app/types/objects";

interface DashboardButtonProps {
  collection: Collection;
  selectCollection: (collection: Collection) => void;
  triggerAnalysis: (collection: Collection, user_id: string) => void;
  user_id: string;
  currentToasts: Toast[];
  unprocessed: boolean;
  deleteCollection: (collection_name: string) => void;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  collection,
  selectCollection,
  triggerAnalysis,
  user_id,
  currentToasts,
  unprocessed,
  deleteCollection,
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
        className={`flex items-center justify-center ${unprocessed ? "bg-warning" : "bg-highlight/10 text-highlight"} rounded-lg w-[3.5rem] h-9 flex-shrink-0 gap-1 px-2`}
      >
        {unprocessed ? (
          <IoIosWarning size={20} className="flex-shrink-0" />
        ) : (
          <p className="text-xs font-bold">{collection.total}</p>
        )}
      </div>

      <div
        className="flex flex-0 items-center justify-start gap-2 w-full hover:bg-foreground_alt p-2 rounded-lg cursor-pointer"
        onClick={() => selectCollection(collection)}
      >
        <p className="truncate w-[15rem] md:w-[20rem] text-sm">
          {collection.name}
        </p>
      </div>

      <div className="flex">
        {!isProcessing && collection.processed && (
          <div className="flex gap-2 items-center justify-start text-xs px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <SlOptionsVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem
                  onClick={() => {
                    triggerAnalysis(collection, user_id);
                  }}
                >
                  <PiMagicWandFill className="text-primary" />
                  <span className="text-primary">Re-Analyze</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    deleteCollection(collection.name);
                  }}
                >
                  <GoTrash className="text-error" />
                  <span className="text-error">Clear</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {!collection.processed && !isProcessing && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              triggerAnalysis(collection, user_id);
            }}
            className="text-primary"
          >
            <PiMagicWandFill className="text-primary" />
            <p>Analyze</p>
          </Button>
        )}
        {isProcessing && (
          <Button disabled={isProcessing} className="text-primary">
            <PiMagicWandFill className="text-primary" />
            <p>Analyzing... {progress}%</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardButton;
