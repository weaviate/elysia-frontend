"use client";

import { DocumentPayload } from "@/app/components/types";
import { IoMdCloseCircle } from "react-icons/io";
import MarkdownMessageDisplay from "./markdown";

import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DocumentModalProps {
  document: DocumentPayload;
  onClose: () => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  const renderContent = () => {
    if (!document.chunk_spans || document.chunk_spans.length === 0) {
      return <MarkdownMessageDisplay text={document.content} />;
    }

    const chunks: JSX.Element[] = [];
    let lastIndex = 0;

    document.chunk_spans.forEach(({ start, end }, index) => {
      // Add non-chunk text before the chunk
      if (lastIndex < start) {
        chunks.push(
          <MarkdownMessageDisplay
            key={`normal-${index}`}
            text={document.content.slice(lastIndex, start)}
          />
        );
      }

      // Add chunk text with highlighting
      chunks.push(
        <div className="flex">
          <div className="relative">
            <span
              key={`chunk-${index}`}
              className="text-primary bg-foreground rounded-md p-3 block"
            >
              {document.content.slice(start, end)}
            </span>
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
              <Badge>Chunk {index + 1}</Badge>
            </div>
          </div>
        </div>
      );

      lastIndex = end;
    });

    // Add remaining text after last chunk
    if (lastIndex < document.content.length) {
      chunks.push(
        <MarkdownMessageDisplay
          key="normal-last"
          text={document.content.slice(lastIndex)}
        />
      );
    }

    return chunks;
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <Card className="fixed top-1/2 bg-background p-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full lg:w-[40vw] h-[85vh] overflow-auto">
          <CardTitle className="flex justify-between items-center w-full">
            <div className="flex flex-col items-start justify-start gap-2 w-full">
              <div className="flex flex-row w-full justify-between items-center">
                <div className="flex flex-col">
                  {document.collection_name && (
                    <p className="text-sm text-secondary font-normal">
                      {document.collection_name}
                    </p>
                  )}
                  <p className="text-xl text-primary">{document.title}</p>
                </div>
                <Button
                  onClick={onClose}
                  className="text-secondary"
                  size={"icon"}
                  variant={"ghost"}
                >
                  <IoMdCloseCircle size={16} />
                </Button>
              </div>
              <p className="text-sm text-secondary">{document.author}</p>
            </div>
          </CardTitle>
          <CardContent className="p-0 h-full">
            <div className="flex flex-col gap-4">{renderContent()}</div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentModal;
