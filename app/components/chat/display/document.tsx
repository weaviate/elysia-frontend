"use client";

import { DocumentPayload } from "@/app/components/types";
import ChunksDisplay from "./chunks_spans";
import { useState } from "react";
import DocumentModal from "./document_modal";
import { MdOpenInNew } from "react-icons/md";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DocumentDisplayProps {
  payload: DocumentPayload[];
}

const DocumentDisplay: React.FC<DocumentDisplayProps> = ({ payload }) => {
  const [currentDocument, setCurrentDocument] =
    useState<DocumentPayload | null>(null);

  const selectDocument = (document: DocumentPayload) => {
    setCurrentDocument(document);
  };

  const deselectDocument = () => {
    setCurrentDocument(null);
  };

  if (payload.length === 0) return null;

  return (
    <Carousel className="w-full flex items-center justify-center gap-3">
      <CarouselPrevious variant="ghost" />
      <CarouselContent>
        {payload.map(
          (p, index) =>
            p.content && (
              <CarouselItem key={index + p.title}>
                <Card className="w-full flex flex-col h-full gap-2 bg-background_alt p-4 rounded-lg border border-secondary">
                  <CardTitle className="flex flex-row justify-between items-center w-full gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                          {p.collection_name && (
                            <p className="text-sm text-secondary font-normal">
                              {p.collection_name}
                            </p>
                          )}
                          {p.title && <p className="font-bold">{p.title}</p>}
                        </div>
                        <Button
                          variant={"ghost"}
                          className="text-secondary"
                          size={"sm"}
                          onClick={() => {
                            selectDocument(p);
                          }}
                        >
                          <MdOpenInNew size={12} />
                          Full document
                        </Button>
                      </div>
                      {p.author && (
                        <p className="text-sm text-secondary">{p.author}</p>
                      )}
                    </div>
                  </CardTitle>
                  <ChunksDisplay
                    _text={p.content}
                    chunk_spans={p.chunk_spans}
                  />
                </Card>
              </CarouselItem>
            )
        )}
      </CarouselContent>
      <CarouselNext variant="ghost" />
      {currentDocument && (
        <DocumentModal document={currentDocument} onClose={deselectDocument} />
      )}
    </Carousel>
  );
};

export default DocumentDisplay;
