"use client";

import { DocumentPayload } from "@/app/types/displays";
import MarkdownFormat from "../../components/MarkdownFormat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoDocumentText } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";

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

  const scrollToTop = () => {
    const contentContainer = global.document.querySelector(".overflow-y-auto");
    if (contentContainer) {
      contentContainer.scrollTo({ top: 0, behavior: "smooth" });
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
          />
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
              <span className="text-primary bg-alt_color_a/10 border border-alt_color_a rounded-md p-3 block">
                <MarkdownFormat text={docPayload.content.slice(start, end)} />
              </span>
              <div className="absolute -top-3.5 right-0 transform -translate-x-1/2">
                <Badge className="gap-1 text-alt_color_a bg-background_alt border border-alt_color_a p-2">
                  <FaBookmark className="text-sm" />
                  {index + 1}
                </Badge>
              </div>
            </div>
          </div>
        </div>
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
        </div>
      );

      lastIndex = end;
    });

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
    <div className="w-full flex flex-col gap-4 h-full min-h-0">
      <div className="flex flex-col gap-3 justify-start items-start sticky top-0 z-10 pb-4 rounded-lg bg-background_alt p-3 sm:p-4 border border-foreground">
        <div className="flex flex-row w-full justify-between gap-2">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <div className="flex flex-row gap-2 justify-between">
              <p className="text-xl sm:text-2xl font-bold text-primary truncate">
                {docPayload.title}
              </p>
              <Button
                variant="default"
                className="bg-primary/10 text-primary text-sm flex-shrink-0 rounded-full w-10 h-10"
                onClick={scrollToTop}
              >
                <FaArrowUp size={16} />
              </Button>
            </div>
            <p className="text-sm text-secondary truncate">
              {docPayload.author}
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col sm:flex-row gap-2">
            {chunks.length > 0 && (
              <Button
                variant="default"
                className="bg-alt_color_a/10 text-alt_color_a text-sm flex-shrink-0"
                onClick={() => setShowChunksOnly(!showChunksOnly)}
              >
                {showChunksOnly ? (
                  <>
                    <IoDocumentText className="mr-1" />
                    <span className="hidden xs:inline">Show Full Document</span>
                    <span className="xs:hidden">Full Doc</span>
                  </>
                ) : (
                  <>
                    <FaBookmark className="mr-1" />
                    <span className="hidden xs:inline">
                      Only Relevant Parts
                    </span>
                    <span className="xs:hidden">Relevant</span>
                  </>
                )}
              </Button>
            )}

            {/* Chunk buttons container with horizontal scroll */}
            {chunks.length > 0 && (
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-foreground/20 scrollbar-track-transparent">
                  {chunks.map((chunk, index) => (
                    <Button
                      key={`chunk-button-${index}`}
                      variant="default"
                      className="bg-alt_color_a/10 text-alt_color_a text-sm flex-shrink-0 min-w-[2.5rem]"
                      onClick={() => scrollToChunk(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 p-3 sm:p-4 border border-foreground bg-background_alt rounded-lg">
        {showChunksOnly ? chunks : doc}
      </div>
    </div>
  );
};

export default DocumentView;
