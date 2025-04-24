"use client";

import { CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ChunkSpan } from "@/app/components/types";
interface ChunksDisplayProps {
  _text: string;
  chunk_spans: ChunkSpan[];
}

const ChunksDisplay: React.FC<ChunksDisplayProps> = ({
  _text,
  chunk_spans,
}) => {
  const [maxCharacters, setMaxCharacters] = useState(500);

  useEffect(() => {
    let max_characters = 500;
    if (chunk_spans.length === 1) {
      max_characters = 800;
    } else if (chunk_spans.length === 2) {
      max_characters = 350;
    } else {
      max_characters = 150;
    }
    setMaxCharacters(max_characters);
  }, [chunk_spans]);

  if (_text.length === 0) return null;

  return (
    <CardContent className="w-full flex flex-col gap-2 p-0 h-full items-center justify-center">
      {chunk_spans && chunk_spans.length > 0 ? (
        chunk_spans.map(({ start, end }, index) => {
          const text = _text.slice(start, end);
          const text_preview = text.slice(0, maxCharacters);

          return (
            <div key={index} className="w-full flex flex-col gap-2">
              <p className="text-sm text-primary leading-relaxed">
                [...] <span className="text-primary">{text_preview}</span>...
              </p>
            </div>
          );
        })
      ) : (
        <div className="w-full flex flex-col gap-2">
          <p className="text-sm text-primary leading-relaxed">
            <span className="text-primary">
              {_text.slice(0, maxCharacters)}
            </span>
            ...
          </p>
        </div>
      )}
    </CardContent>
  );
};

export default ChunksDisplay;
