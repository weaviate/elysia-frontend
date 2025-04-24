"use client";

import React, { useState } from "react";

import { Message, ResultPayload, Ticket } from "../../types";
import TicketMessageDisplay from "./Ticket";

interface TicketsDisplayProps {
  message: Message;
}

const TicketsDisplay: React.FC<TicketsDisplayProps> = ({ message }) => {
  const payload = message.payload as ResultPayload;
  const tickets = payload.objects as Ticket[];

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleSelectTicket = (ticket: Ticket) => {
    if (selectedTicket?.uuid === ticket.uuid) {
      setSelectedTicket(null);
    } else {
      setSelectedTicket(ticket);
    }
  };

  if (tickets.length === 0) return null;

  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <div
        className={`flex flex-col w-full chat-animation justify-start items-start gap-1 ${
          selectedTicket === null ? "h-[27vh]" : "h-fit"
        } overflow-y-scroll border border-foreground rounded-lg p-2`}
      >
        {selectedTicket === null &&
          tickets.map((ticket, idx) => (
            <TicketMessageDisplay
              key={`${idx}-${message.id}`}
              selected={false}
              ticket={ticket}
              onSelect={() => handleSelectTicket(ticket)}
            />
          ))}
        {selectedTicket && (
          <TicketMessageDisplay
            ticket={selectedTicket}
            selected={true}
            onSelect={() => handleSelectTicket(selectedTicket)}
          />
        )}
      </div>
    </div>
  );
};

export default TicketsDisplay;
