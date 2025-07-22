"use client";

import React from "react";

import { TicketPayload } from "@/app/types/displays";
import TicketCard from "./TicketCard";
import DisplayPagination from "../../components/DisplayPagination";

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
    <DisplayPagination>
      {tickets.map((ticket, idx) => (
        <TicketCard
          key={`${idx}-${ticket.id}`}
          ticket={ticket}
          handleOpen={() => handleResultPayloadChange("ticket", ticket)}
        />
      ))}
    </DisplayPagination>
  );
};

export default TicketDisplay;
