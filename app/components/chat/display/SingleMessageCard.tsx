"use client";

import React from "react";
import { SingleMessageType } from "@/app/types/displays";
import MarkdownFormat from "./MarkdownFormat";

interface SingleMessageCardProps {
    message: SingleMessageType;
    id?: string;
}

const SingleMessageCard: React.FC<SingleMessageCardProps> = ({ message, id }) => {
    const formatDate = (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    };

    return (
        <div className="flex flex-col gap-2" id={id}>
            <p className="text-md text-accent font-bold pl-2">{message.author}</p>

            <div className={`flex flex-col gap-2 border rounded-lg ${message.relevant ? 'border-accent' : 'border-secondary'}`}>
                <p className="text-primary text-xs p-5">
                    <MarkdownFormat text={message.content} />
                </p>
            </div>
            <div className="flex flex-row gap-2 justify-end">
                <p className="text-secondary text-xs">
                    {formatDate(message.timestamp)}
                </p>
            </div>
        </div>
    );
};

export default SingleMessageCard;