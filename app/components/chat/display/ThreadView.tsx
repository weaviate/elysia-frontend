"use client";

import React, { useState } from "react";
import { ThreadType, SingleMessageType } from "@/app/types/displays";
import { Badge } from "@/components/ui/badge";
import FullScreenOverlay from "../FullScreenOverlay";
import { IoMdArrowUp } from "react-icons/io";
import { Button } from "@/components/ui/button";
import SingleMessageCard from "./SingleMessageCard";

interface ThreadViewProps {
    thread: ThreadType;
    onClose: () => void;
    isOpen: boolean;
}

const ThreadView: React.FC<ThreadViewProps> = ({ thread, isOpen, onClose }) => {
    const authors = thread.messages.map((message) => message.author);
    const uniqueAuthors = [...new Set(authors)];
    const authorsTitle = uniqueAuthors.length > 4 
    ? `${uniqueAuthors[0]} & others`
    : uniqueAuthors.join(", ");
    const chunks = thread.messages.filter((message) => message.relevant === true);


    console.log("chunks", chunks);
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
    return (
        <FullScreenOverlay
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="w-1/2 max-w-6xl mx-auto relative">

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
                        {thread.summary && (
                            <p className="text-sm text-secondary font-normal">
                                {thread.summary}
                            </p>
                        )}
                        <p className="text-2xl text-primary">{authorsTitle}</p>
                        <div className="flex flex-row gap-2">
                            {chunks && chunks.map((chunk, index) => (
                                <Button variant="outline" onClick={() => scrollToSegment(index)}>{index + 1}</Button>
                            ))}
                        </div>
                    </div>
                    {chunks && (
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
                    {showChunksOnly 
                        ? chunks?.map((chunk, index) => (
                            <SingleMessageCard key={chunk.message_id || index} message={chunk} />
                        ))
                        : thread.messages.map((message, index) => {
                            // Find the chunk index if this message is relevant
                            const chunkIndex = message.relevant ? chunks.indexOf(message) : null;
                            return (
                                <div
                                    key={message.message_id || index}
                                    id={message.relevant ? `chunk-${chunkIndex}` : undefined}
                                >
                                    <SingleMessageCard message={message} />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </FullScreenOverlay>
    );
};

export default ThreadView;