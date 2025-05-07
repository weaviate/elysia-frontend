"use client";

import React, { useState } from "react";

import { Message, ResultPayload } from "../../types";
import { TicketType } from "@/app/types/displays";
import TicketCard from "./TicketCard";
import TicketView from "./TicketView";

interface TicketDisplayProps {
  message: Message;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({ message }) => {
  const payload = message.payload as ResultPayload;
  const tickets = payload.objects as TicketType[];
  const [selectedItem, setSelectedItem] = useState<TicketType | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleOpen = (item: TicketType) => {
    setSelectedItem(item);
    setIsViewOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsViewOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };



  if (tickets.length === 0) return null;

  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <div
        className={`flex flex-col w-full chat-animation justify-start items-start gap-1 ${
          selectedItem === null ? "h-[27vh]" : "h-fit"
        } overflow-y-scroll rounded-lg p-2`}
      >
        {tickets.map((ticket, idx) => (
          <TicketCard
            key={`${idx}-${message.id}`}
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
