"use client";

import { DocumentPayload, ChunkSpan } from "@/app/types/displays";
import MarkdownFormat from "./MarkdownFormat";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FullScreenOverlay from "@/app/components/chat/FullScreenOverlay";

interface DocumentViewProps {
  document: DocumentPayload;
  onClose: () => void;
  isOpen: boolean;
}

const DocumentView: React.FC<DocumentViewProps> = ({ document, onClose, isOpen }) => {
  const renderContent = () => {
    if (!document.chunk_spans || document.chunk_spans.length === 0) {
      console.log("Returning full content")
      return <MarkdownFormat text={document.content} />;
    }

    const chunks: JSX.Element[] = [];
    let lastIndex = 0;

    document.chunk_spans.forEach(({ start, end }, index) => {
      // Add non-chunk text before the chunk
      if (lastIndex < start) {
        chunks.push(
          <MarkdownFormat
            key={`normal-${index}`}
            text={document.content.slice(lastIndex, start)}
          />
        );
      }

      // TODO: this breaks if the chunk is in the middle of some markdown formatting, fix this
      chunks.push(
        <div className="flex">
          <div className="relative">
            <span
              key={`chunk-${index}`}
              className="text-primary bg-foreground rounded-md p-3 block"
            >
              <MarkdownFormat key={`chunk-${index}`} text={document.content.slice(start, end)} />
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
        <MarkdownFormat
          key="normal-last"
          text={document.content.slice(lastIndex)}
        />
      );
    }

    return chunks;
  };

  return (
    <FullScreenOverlay
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col items-start justify-start gap-2 w-full">
              {document.collection_name && (
                <p className="text-sm text-secondary font-normal">
                  {document.collection_name}
                </p>
              )}
              <p className="text-xl text-primary">{document.title}</p>
              <p className="text-sm text-secondary">{document.author}</p>
            </div>

            <div className="flex flex-col gap-4">
              {renderContent()}
            </div>

      </div>
    </FullScreenOverlay>
  );
};

export default DocumentView;
