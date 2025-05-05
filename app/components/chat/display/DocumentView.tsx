"use client";

import { DocumentPayload, ChunkSpan } from "@/app/types/displays";
import MarkdownFormat from "./MarkdownFormat";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FullScreenOverlay from "@/app/components/chat/FullScreenOverlay";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdArrowUp, IoMdClose } from "react-icons/io";

interface DocumentViewProps {
  document: DocumentPayload;
  onClose: () => void;
  isOpen: boolean;
}

const DocumentView: React.FC<DocumentViewProps> = ({ document: docPayload, onClose, isOpen }) => {
  const [showChunksOnly, setShowChunksOnly] = useState(false);

  const scrollToTop = () => {
    const container = global.document.querySelector('.document-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSegment = (index: number) => {
    const element = global.document.getElementById(`chunk-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const renderContent = () => {
    if (!docPayload.chunk_spans || docPayload.chunk_spans.length === 0) {
      console.log("Returning full content")
      return { doc: <MarkdownFormat text={docPayload.content} />, chunks: [] };
    }

    const doc: JSX.Element[] = [];
    const chunks: JSX.Element[] = [];
    let lastIndex = 0;

    docPayload.chunk_spans.forEach(({ start, end }, index) => {
      // Add non-chunk text before the chunk
      if (lastIndex < start) {
        doc.push(
          <MarkdownFormat
            key={`normal-${index}`}
            text={docPayload.content.slice(lastIndex, start)}
          />
        );
      }

      // Add the chunk with an ID for scrolling
      doc.push(
        <div id={`chunk-${index}`} key={`chunk-${index}`} className="transition-colors duration-200">
          <div className="flex">
            <div className="relative">
              <span className="text-primary bg-foreground rounded-md p-3 block">
                <MarkdownFormat text={docPayload.content.slice(start, end)} />
              </span>
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                <Badge>Segment {index + 1}</Badge>
              </div>
            </div>
          </div>
        </div>
      );

      chunks.push(
        <div
          key={`chunk-${index}`}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => scrollToSegment(index)}
        >
          <div className="relative">
            <span className="text-primary bg-foreground rounded-md p-3 block">
              <MarkdownFormat text={docPayload.content.slice(start, end)} />
            </span>
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
              <Badge>Segment {index + 1}</Badge>
            </div>
          </div>
        </div>
      );

      lastIndex = end;
    });

    // Add remaining text after last chunk
    if (lastIndex < docPayload.content.length) {
      doc.push(
        <MarkdownFormat
          key="normal-last"
          text={docPayload.content.slice(lastIndex)}
        />
      );
    }

    return { doc, chunks };
  };

  const { doc, chunks } = renderContent();

  return (
    <FullScreenOverlay
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="w-full max-w-6xl mx-auto relative">

        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 bg-background/80"
        >
          <IoMdArrowUp />
        </Button>

        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col items-start justify-start gap-2">
            {docPayload.collection_name && (
              <p className="text-sm text-secondary font-normal">
                {docPayload.collection_name}
              </p>
            )}
            <p className="text-2xl text-primary">{docPayload.title}</p>
            <p className="text-sm text-secondary">{docPayload.author}</p>
            <div className="flex flex-row gap-2">
              {chunks.length > 0 && chunks.map((chunk, index) => (
                <Button variant="outline" onClick={() => scrollToSegment(index)}>{index + 1}</Button>
              ))}
            </div>
          </div>
          {chunks.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowChunksOnly(!showChunksOnly)}
              className="mt-2"
            >
              {showChunksOnly ? "Show Full Document" : "Show Segments Only"}
            </Button>
          )}

        </div>

        <div className="flex flex-col gap-4">
          {showChunksOnly ? chunks : doc}
        </div>
      </div>
    </FullScreenOverlay>
  );
};

export default DocumentView;
