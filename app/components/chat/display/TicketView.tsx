"use client";

// TODO: everything

import React, { useState } from "react";
import { TicketPayload } from "@/app/types/displays";
import { Badge } from "@/components/ui/badge";
import FullScreenOverlay from "../FullScreenOverlay";
import { IoMdArrowUp } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

interface TicketViewProps {
    ticket: TicketPayload;
    onClose: () => void;
    isOpen: boolean;
}

const TicketView: React.FC<TicketViewProps> = ({ ticket, isOpen, onClose }) => {

    const scrollToTop = () => {
        const container = global.document.querySelector('.document-container');
        if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const openLink = () => {
        window.open(ticket.url, "_blank");
    };


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

                <div className="w-2/3 flex flex-col gap-3 justify-start items-start">
                    <div className="flex flex-row w-full justify-between gap-2">
                        <div className="flex flex-col gap-2">
                            {ticket.url && (
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openLink();
                                    }}
                                    variant="ghost"
                                    className="text-secondary -ml-2"
                                    size="icon"
                                >
                                    <FaGithub size={16} />
                                </Button>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-primary">{ticket.title}</p>
                        <p className="text-md font-bold text-primary">{ticket.subtitle}</p>

                    </div>
                    <div>
                        <p className="text-md font-bold text-primary">{ticket.author}</p>
                        <p className="text-md font-bold text-primary">{ticket.comments}</p>
                        {ticket.summary && (
                            <p className="text-sm text-secondary font-normal">
                                {ticket.summary}
                            </p>
                        )}
                        <p className="text-sm text-secondary font-normal">
                            {ticket.content}
                        </p>
                        <p className="text-sm text-secondary font-normal">
                            {ticket.updated_at}
                        </p><p className="text-sm text-secondary font-normal">
                            {ticket.created_at}
                        </p>
                    </div>
                    <div className="flex flex-row justify-end gap-2 w-1/4 overflow-hidden">
                        {ticket.status === "open" && (
                            <Badge className="bg-background_accent text-white text-[10px] p-1">Open</Badge>
                        )}
                        {ticket.status === "closed" && (
                            <Badge className="bg-background_error text-white text-[10px] p-1">Closed</Badge>
                        )}
                        {ticket.status !== "open" && ticket.status !== "closed" && (
                            <Badge className="bg-foreground text-white text-[10px] p-1">
                                {ticket.status}
                            </Badge>
                        )}
                        {ticket.tags.length > 0 &&
                            ticket.tags.map((label, idx) => (
                                <Badge
                                    key={`${idx}-${label}`}
                                    className="bg-foreground text-white text-[10px] p-1"
                                >
                                    {label}
                                </Badge>
                            ))}
                    </div>
                </div>
            </div>
        </FullScreenOverlay>
    );
};

export default TicketView;