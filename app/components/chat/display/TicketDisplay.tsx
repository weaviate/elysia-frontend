"use client";

import React from "react";

import { TicketPayload } from "@/app/types/displays";
import TicketCard from "./TicketCard";

interface TicketDisplayProps {
  tickets: TicketPayload[];
  handleResultPayloadChange: (type: string, payload: TicketPayload) => void;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({
  tickets,
  handleResultPayloadChange,
}) => {
  if (tickets.length === 0) return null;

  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <div
        className={`flex flex-col w-full chat-animation justify-start items-start gap-2 h-[30vh] overflow-y-scroll rounded-lg`}
      >
        {tickets.map((ticket, idx) => (
          <TicketCard
            key={`${idx}-${ticket.id}`}
            ticket={ticket}
            handleOpen={() => handleResultPayloadChange("ticket", ticket)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketDisplay;
