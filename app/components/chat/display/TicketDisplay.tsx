"use client";

import React, { useState } from "react";

import { TicketPayload } from "@/app/types/displays";
import TicketCard from "./TicketCard";
import TicketView from "./TicketView";

interface TicketDisplayProps {
  tickets: TicketPayload[];
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({ tickets }) => {
  const [selectedItem, setSelectedItem] = useState<TicketPayload | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleOpen = (item: TicketPayload) => {
    setSelectedItem(item);
    setIsViewOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleClose = () => {
    setIsViewOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = "unset";
  };

  if (tickets.length === 0) return null;

  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <div
        className={`flex flex-col w-full chat-animation justify-start items-start gap-2 h-[27vh] overflow-y-scroll rounded-lg pr-4`}
      >
        {tickets.map((ticket, idx) => (
          <TicketCard
            key={`${idx}-${ticket.id}`}
            ticket={ticket}
            handleOpen={() => handleOpen(ticket)}
          />
        ))}
        {selectedItem && (
          <TicketView
            ticket={selectedItem}
            isOpen={isViewOpen}
            onClose={() => handleClose()}
          />
        )}
      </div>
    </div>
  );
};

export default TicketDisplay;
