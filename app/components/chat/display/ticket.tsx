"use client";

import React, { useEffect, useState } from "react";
import { Ticket } from "../../types";
import MarkdownMessageDisplay from "./markdown";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaGithub } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

interface TicketMessageDisplayProps {
  ticket: Ticket;
  selected: boolean;
  onSelect: () => void;
}

const TicketMessageDisplay: React.FC<TicketMessageDisplayProps> = ({
  ticket,
  selected,
  onSelect,
}) => {
  const [showSummary, setShowSummary] = useState(ticket.summary ? true : false);

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

  const toggleSummary = () => {
    setShowSummary((prev) => !prev);
  };

  const [showText, setShowText] = useState("");

  useEffect(() => {
    if (ticket.summary && showSummary) {
      setShowText(ticket.summary);
    } else {
      setShowText(ticket.content);
    }
  }, [ticket, showSummary]);

  return (
    <Card
      className={`flex flex-col w-full bg-foreground p-4 gap-4 rounded-md justify-start items-start ${
        selected ? "border-none" : "hover:bg-foreground_alt cursor-pointer"
      }`}
      onClick={!selected ? () => onSelect() : () => {}}
    >
      <CardTitle className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1">
            <p className="text-primary font-bold">{ticket.title}</p>
            {ticket.url && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openLink();
                }}
                variant="ghost"
                className="text-secondary"
                size="icon"
              >
                <FaGithub size={12} />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {ticket.status === "open" && (
              <Badge className=" bg-background_accent text-white">Open</Badge>
            )}
            {ticket.status === "closed" && (
              <Badge className=" bg-background_error text-white">Closed</Badge>
            )}
            {ticket.status !== "open" && ticket.status !== "closed" && (
              <Badge className=" bg-foreground text-white">
                {ticket.status}
              </Badge>
            )}
            {ticket.tags.length > 0 &&
              ticket.tags.map((label, idx) => (
                <Badge
                  key={`${idx}-${label}`}
                  className=" bg-foreground text-white"
                >
                  {label}
                </Badge>
              ))}
            {selected && (
              <Button
                variant="ghost"
                size="icon"
                className="text-error"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
              >
                <IoMdCloseCircle size={16} />
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center w-full gap-2">
          <p className="text-xs font-light text-secondary">
            <span className="font-bold">{ticket.author}</span> opened this on{" "}
            {formatDate(ticket.created_at)}
          </p>
          {selected && ticket.summary && (
            <Button
              variant="ghost"
              size="sm"
              className="text-secondary"
              onClick={(e) => {
                e.stopPropagation();
                toggleSummary();
              }}
            >
              {ticket.summary && showSummary ? "Show Original" : "Show Summary"}
            </Button>
          )}
        </div>
      </CardTitle>
      {selected && (
        <CardContent className="p-0 fade-in w-full overflow-x-scroll">
          <MarkdownMessageDisplay text={showText} />
        </CardContent>
      )}
    </Card>
  );
};

export default TicketMessageDisplay;
