"use client";

import React, { useState } from "react";
import { TicketPayload } from "@/app/types/displays";
import { Badge } from "@/components/ui/badge";
import FullScreenOverlay from "../FullScreenOverlay";
import { IoMdArrowUp } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import MarkdownFormat from "./MarkdownFormat";

interface TicketViewProps {
  ticket: TicketPayload;
  onClose: () => void;
  isOpen: boolean;
}

const TicketView: React.FC<TicketViewProps> = ({ ticket, isOpen, onClose }) => {
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const scrollToTop = () => {
    const container = global.document.querySelector(".document-container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openLink = () => {
    window.open(ticket.url, "_blank");
  };

  return (
    <FullScreenOverlay isOpen={isOpen} onClose={onClose}>
      <div className="w-full md:w-5/6 max-w-6xl mx-auto relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 bg-background/80"
        >
          <IoMdArrowUp />
        </Button>

        <div className="w-full flex flex-col gap-3 justify-start items-start">
          <div className="flex flex-col w-full">
            <p className="text-3xl font-bold text-primary pb-2">
              {ticket.title}
            </p>
            <div className="flex flex-row justify-between items-center w-full gap-2">
              <div className="flex flex-row justify-start items-center gap-2">
                {ticket.status === "open" && (
                  <Badge className="bg-background_accent text-white text-sm p-2">
                    Open
                  </Badge>
                )}
                {ticket.status === "closed" && (
                  <Badge className="bg-background_error text-white text-sm p-2">
                    Closed
                  </Badge>
                )}
                {ticket.status !== "open" && ticket.status !== "closed" && (
                  <Badge className="bg-foreground text-white text-sm p-2">
                    {ticket.status}
                  </Badge>
                )}

                {ticket.tags.length > 0 && (
                  <>
                    <div className="h-6 border-l border-secondary mx-2"></div>
                    {ticket.tags.map((label, idx) => (
                      <Badge
                        key={`${idx}-${label}`}
                        className="bg-foreground text-white text-sm p-2"
                      >
                        {label}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
              {ticket.url && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLink();
                  }}
                  variant="ghost"
                  className="text-secondary h-[52px] w-[52px] hover:bg-background-none"
                  size="icon"
                >
                  <FaGithub size={48} />
                </Button>
              )}
            </div>

            <p className="text-sm text-primary">{ticket.subtitle}</p>
          </div>
          <hr className="w-full border-secondary" />
          <div className="w-full flex flex-row gap-4">
            <div className="w-3/4 flex flex-col gap-2 bg-background_alt border border-secondary rounded-lg h-fit">
              <div className="flex flex-row w-full bg-foreground border-b border-secondary rounded-t-lg gap-1 p-2">
                <p className="text-sm font-bold text-primary">
                  {ticket.author}
                </p>
                <p className="text-sm text-primary">
                  opened this on {formatDate(ticket.created_at)}
                </p>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <p className="text-md text-primary font-normal">
                  <MarkdownFormat text={ticket.content} />
                </p>
              </div>
            </div>
            <div className="w-1/4 flex flex-col gap-2 p-2">
              {ticket.summary && (
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-sm font-bold text-secondary">Summary</p>
                  <p className="text-xs text-primary font-normal">
                    {ticket.summary}
                  </p>
                  <hr className="w-full border-secondary mt-4" />
                </div>
              )}

              <p className="text-sm font-bold text-secondary">Comments</p>
              <p className="text-xs text-primary font-normal">
                {ticket.comments}
              </p>
              <hr className="w-full border-secondary mt-4" />
              <p className="text-sm font-bold text-secondary">Last updated</p>
              <p className="text-xs text-primary font-normal">
                {formatDate(ticket.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </FullScreenOverlay>
  );
};

export default TicketView;
