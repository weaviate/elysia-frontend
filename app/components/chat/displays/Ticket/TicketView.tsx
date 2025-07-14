"use client";

import React from "react";
import { TicketPayload } from "@/app/types/displays";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MarkdownFormat from "../../components/MarkdownFormat";
import { GoIssueOpened, GoIssueClosed } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
import { IoUnlinkOutline } from "react-icons/io5";

interface TicketViewProps {
  ticket: TicketPayload;
}

const TicketView: React.FC<TicketViewProps> = ({ ticket }) => {
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
    <div className="w-full flex flex-col gap-3 justify-start items-start">
      <div className="flex flex-col w-full gap-1">
        <p className="text-lg text-primary">{ticket.title}</p>
        <div className="flex flex-row justify-between items-center w-full gap-1">
          <div className="flex flex-row justify-start items-center gap-1">
            {ticket.status === "open" && (
              <Badge className="bg-accent">
                <GoIssueOpened />
                Open
              </Badge>
            )}
            {ticket.status === "closed" && (
              <Badge className="bg-error">
                <GoIssueClosed />
                Closed
              </Badge>
            )}
            {ticket.status !== "open" && ticket.status !== "closed" && (
              <Badge className="bg-background_alt">{ticket.status}</Badge>
            )}

            {ticket.tags.length > 0 && (
              <>
                <div className="h-6 border-l border-secondary mx-2"></div>
                {ticket.tags.map((label, idx) => (
                  <Badge key={`${idx}-${label}`} className="bg-background_alt">
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
              className="h-9 w-9"
            >
              <IoUnlinkOutline size={24} />
            </Button>
          )}
        </div>
        <p className="text-sm text-primary">{ticket.subtitle}</p>
      </div>
      <Separator />
      <div className="w-full flex flex-col lg:flex-row gap-2">
        <div className="lg:w-4/5 w-full flex flex-col bg-background_alt rounded-lg h-fit">
          <div className="flex flex-row w-full bg-foreground rounded-t-lg gap-1 p-3">
            <p className="text-sm font-bold text-primary">{ticket.author}</p>
            <p className="text-sm text-primary">
              opened this on {formatDate(ticket.created_at)}
            </p>
          </div>
          <div className="flex flex-col p-4 justify-start items-start overflow-x-auto">
            <MarkdownFormat text={ticket.content} />
          </div>
          {ticket.ELYSIA_SUMMARY && (
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm font-bold text-secondary">Summary</p>
              <p className="text-xs text-primary font-normal">
                {ticket.ELYSIA_SUMMARY}
              </p>
              <Separator />
            </div>
          )}
        </div>

        <div className="lg:w-1/5 w-full flex flex-col gap-2 p-2">
          {ticket.comments && (
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-secondary">Comments</p>
              <p className="text-xs text-primary font-normal">
                {ticket.comments}
              </p>
              <Separator />
            </div>
          )}

          {ticket.updated_at && (
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm  text-secondary">Last updated</p>
              <p className="text-xs text-primary font-normal">
                {formatDate(ticket.updated_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketView;
