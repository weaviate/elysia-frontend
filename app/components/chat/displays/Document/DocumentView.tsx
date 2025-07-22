"use client";

import { DocumentPayload } from "@/app/types/displays";
import MarkdownFormat from "../../components/MarkdownFormat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoDocumentText } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa6";

interface DocumentViewProps {
  document: DocumentPayload;
}

const DocumentView: React.FC<DocumentViewProps> = ({
  document: docPayload,
}) => {
  const [showChunksOnly, setShowChunksOnly] = useState(false);

  const scrollToChunk = (index: number) => {
    const element = global.document.getElementById(`chunk-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const renderContent = () => {
    if (!docPayload.chunk_spans || docPayload.chunk_spans.length === 0) {
      return { doc: <MarkdownFormat text={docPayload.content} />, chunks: [] };
    }

    const doc: JSX.Element[] = [];
    const chunks: JSX.Element[] = [];
    let lastIndex = 0;

    docPayload.chunk_spans.forEach(({ start, end }, index) => {
      if (lastIndex < start) {
        doc.push(
          <MarkdownFormat
            key={`normal-${index}`}
            text={docPayload.content.slice(lastIndex, start)}
          />,
        );
      }

      doc.push(
        <div
          id={`chunk-${index}`}
          key={`chunk-${index}`}
          className="transition-colors duration-200"
        >
          <div className="flex">
            <div className="relative">
              <span className="text-primary bg-background_alt rounded-md p-3 block">
                <MarkdownFormat text={docPayload.content.slice(start, end)} />
              </span>
              <div className="absolute -top-3.5 right-0 transform -translate-x-1/2">
                <Badge className="gap-1">
                  <FaBookmark className="text-primary text-sm" />
                  {index + 1}
                </Badge>
              </div>
            </div>
          </div>
        </div>,
      );

      chunks.push(
        <div key={`chunk-${index}`} onClick={() => scrollToChunk(index)}>
          <div className="relative">
            <span className="text-primary bg-background_alt rounded-md p-3 block">
              <MarkdownFormat text={docPayload.content.slice(start, end)} />
            </span>
            <div className="absolute -top-3.5 right-0 transform -translate-x-1/2">
              <Badge className="gap-1 text-sm">
                <FaBookmark className="text-primary text-sm" />
                {index + 1}
              </Badge>
            </div>
          </div>
        </div>,
      );

      lastIndex = end;
    });

    if (lastIndex < docPayload.content.length) {
      doc.push(
        <MarkdownFormat
          key="normal-last"
          text={docPayload.content.slice(lastIndex)}
        />,
      );
    }

    return { doc, chunks };
  };

  const { doc, chunks } = renderContent();

  return (
    <div className="w-full flex flex-col gap-4 h-full bg-background_alt/50 px-4 py-2">
      <div className="flex flex-col gap-3 justify-start items-start sticky top-0 z-10 pb-4">
        <div className="flex flex-row w-full justify-between gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold text-primary">
              {docPayload.title}
            </p>
            <p className="text-sm text-secondary">{docPayload.author}</p>
          </div>
        </div>

        {chunks.length > 0 && (
          <div className="flex flex-row gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-background_alt text-primary text-sm"
              onClick={() => setShowChunksOnly(!showChunksOnly)}
            >
              {showChunksOnly ? (
                <>
                  <IoDocumentText />
                  <span>Show Full Document</span>
                </>
              ) : (
                <>
                  <FaBookmark />
                  <span>Only Relevant Parts</span>
                </>
              )}
            </Button>
            {chunks.map((chunk, index) => (
              <Button
                key={`chunk-button-${index}`}
                variant="default"
                size="sm"
                className="bg-background_alt text-primary text-sm"
                onClick={() => scrollToChunk(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 py-2 overflow-y-auto max-h-[calc(80vh-200px)] pr-4">
        {showChunksOnly ? chunks : doc}
      </div>
    </div>
  );
};

export default DocumentView;
