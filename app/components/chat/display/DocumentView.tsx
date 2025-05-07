"use client";


// TODO: Figure out how we chunk if we chunk correctly to try to fix the formatting 
// See if we can ask GPT about putting the "chunk" tag behind 

import { DocumentPayload, ChunkSpan } from "@/app/types/displays";
import MarkdownFormat from "./MarkdownFormat";
import { Badge } from "@/components/ui/badge";
import FullScreenOverlay from "@/app/components/chat/FullScreenOverlay";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdArrowUp, IoMdClose } from "react-icons/io";
import { BsGridFill } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";



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

  const scrollToChunk = (index: number) => {
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
                <Badge className="gap-1">
                  <BsGridFill className="text-background text-xs" />
                  {index + 1}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      );

      chunks.push(
        <div
          key={`chunk-${index}`}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => scrollToChunk(index)}
        >
          <div className="relative">
            <span className="text-primary bg-foreground rounded-md p-3 block">
              <MarkdownFormat text={docPayload.content.slice(start, end)} />
            </span>
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
              <Badge className="gap-1">
                <BsGridFill className="text-background text-xs" />
                {index + 1}
              </Badge>
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
      <div className="w-full md:w-2/3 max-w-6xl mx-auto relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 bg-background/80"
        >
          <IoMdArrowUp />
        </Button>

        <div className="w-2/3 flex flex-col gap-3 justify-start items-start p-8 bg-background rounded-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-row w-full justify-between gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold text-primary">{docPayload.title}</p>
              <p className="text-sm text-secondary">{docPayload.author}</p>
            </div>
            {docPayload.collection_name && (
              <p className="text-sm text-secondary font-normal">
                {docPayload.collection_name}
              </p>
            )}
          </div>
          {chunks.length > 0 && (
            <div className="flex flex-row gap-2">
              <Button variant="default" className="bg-foreground text-primary" onClick={() => setShowChunksOnly(!showChunksOnly)}>
                {showChunksOnly ? (
                  <>
                    <IoDocumentText />
                    <span>Show Full Document</span>
                  </>
                ) : (
                  <>
                    <BsGridFill />
                    <span>Only Show Relevant</span>
                  </>
                )}
              </Button>
              {chunks.map((chunk, index) => (
                <Button variant="default" className="bg-foreground text-primary" onClick={() => scrollToChunk(index)}>{index + 1}</Button>
              ))}
            </div>
          )}

        </div>

        <div className="mt-[150px] flex flex-col gap-4 bg-background_alt rounded-lg p-8">
          {showChunksOnly ? chunks : doc}
        </div>
      </div>
    </FullScreenOverlay>
  );
};

export default DocumentView;
