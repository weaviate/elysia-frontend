"use client";

import { DocumentPayload } from "@/app/types/displays";
import { useState } from "react";
import DocumentView from "./DocumentView";
import { Card, CardTitle } from "@/components/ui/card";

interface DocumentDisplayProps {
  payload: DocumentPayload[];
}

const DocumentDisplay: React.FC<DocumentDisplayProps> = ({ payload }) => {
  const [selectedItem, setSelectedItem] = useState<DocumentPayload | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleOpen = (item: DocumentPayload) => {
    setSelectedItem(item);
    setIsViewOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsViewOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };


  if (payload.length === 0) return null;

  return (
    <div className="flex flex-col w-full chat-animation justify-start items-start gap-1 h-[36vh] overflow-y-scroll">
      {payload.map((document, idx) => (
        <Card key={idx + document.title} className="w-full h-[12vh] bg-background_alt py-2 px-4 rounded-lg border border-transparent hover:bg-foreground hover:border-secondary cursor-pointer transition-all duration-300" onClick={() => handleOpen(document)}>
          <CardTitle className="flex flex-col gap-1">
            <div className="flex flex-row justify-between">
              <p className="text-xs font-light text-secondary">{document.collection_name}</p>
              <div className="flex flex-row gap-1">
                <p className="text-xs text-light text-secondary">Segments: </p>
                <p className="text-xs text-accent">{document.chunk_spans && document.chunk_spans.length}</p>
              </div>
            </div>
            <h1 className="text-sm overflow-hidden text-ellipsis whitespace-nowra pb-1">{document.title}</h1>
          </CardTitle>
        </Card>
      ))}
      {selectedItem && (
        <DocumentView
          document={selectedItem}
          onClose={handleClose}
          isOpen={isViewOpen}
        />
      )}
    </div>
  );
};

export default DocumentDisplay;
