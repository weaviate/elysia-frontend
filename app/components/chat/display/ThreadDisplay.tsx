"use client";

import React, { useEffect, useState } from "react";
import MarkdownFormat from "./MarkdownFormat";
import { ThreadType, SingleMessageType } from "@/app/types/displays";
import ThreadPreviewCard from "./ThreadPreviewCard";
import ThreadView from "./ThreadView";
interface ThreadDisplayProps {
  payload: ThreadType[];
}

const ThreadDisplay: React.FC<ThreadDisplayProps> = ({ payload }) => {
  const [selectedItem, setSelectedItem] = useState<ThreadType | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleOpen = (item: ThreadType) => {
    setSelectedItem(item);
    setIsViewOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsViewOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="w-full flex flex-col max-h-[35vh] overflow-y-auto rounded-md p-4">
      {payload.map((message, idx) => (
        <ThreadPreviewCard thread={message} handleOpen={handleOpen} />
      ))}
      {selectedItem && (
        <ThreadView
          thread={selectedItem}
          onClose={handleClose}
          isOpen={isViewOpen}
        />
      )}
    </div>
  );
};

export default ThreadDisplay;
