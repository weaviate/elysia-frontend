"use client";

import React from "react";
import { TicketPayload } from "@/app/types/displays";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaGithub } from "react-icons/fa";
import { GoIssueOpened, GoIssueClosed } from "react-icons/go";

interface TicketCardProps {
  ticket: TicketPayload;
  handleOpen: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, handleOpen }) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openLink = () => {
    window.open(ticket.url, "_blank");
  };

  return (
    <Card
      className="flex flex-col border-transparent w-full bg-background_alt px-3 py-2 rounded-md justify-start items-start hover:bg-foreground cursor-pointer transition-all duration-300"
      onClick={handleOpen}
      data-ref-id={ticket._REF_ID}
    >
      <CardTitle className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center w-3/4">
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
                <FaGithub size={10} />
              </Button>
            )}
            <p className="text-sm text-primary truncate">{ticket.title}</p>
          </div>
          <div className="flex flex-row justify-end gap-2 w-1/4 overflow-hidden">
            {ticket.status === "open" && (
              <Badge className="bg-accent ">
                <GoIssueOpened size={12} />
                Open
              </Badge>
            )}
            {ticket.status === "closed" && (
              <Badge className="bg-error">
                <GoIssueClosed size={12} />
                Closed
              </Badge>
            )}
            {ticket.status !== "open" && ticket.status !== "closed" && (
              <Badge className="bg-foreground">{ticket.status}</Badge>
            )}
          </div>
        </div>
        <p className="w-full text-xs font-light text-secondary">
          <span className="font-bold">{ticket.author}</span> opened this on{" "}
          {formatDate(ticket.created_at)}
        </p>
      </CardTitle>
    </Card>
  );
};

export default TicketCard;
