"use client";

import React from "react";
import {
  DocumentPayload,
  ThreadPayload,
  TicketPayload,
} from "@/app/types/displays";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { ProductPayload } from "@/app/types/displays";
import ProductView from "./displays/Product/ProductView";
import ThreadView from "./displays/MessageThread/ThreadView";
import DocumentView from "./displays/Document/DocumentView";
import TicketView from "./displays/Ticket/TicketView";

interface RenderDisplayViewProps {
  payload: any;
  type: string;
  handleViewChange: (view: "chat" | "code" | "result", payload: any) => void;
}

const RenderDisplayView: React.FC<RenderDisplayViewProps> = ({
  payload,
  type,
  handleViewChange,
}) => {
  const onClose = () => {
    handleViewChange("chat", null);
  };

  const renderResult = () => {
    switch (type) {
      case "ticket":
        return <TicketView ticket={payload as TicketPayload} />;
      case "product":
      case "ecommerce":
        return <ProductView product={payload as ProductPayload} />;
      case "thread":
        return <ThreadView thread={payload as ThreadPayload} />;
      case "document":
        return <DocumentView document={payload as DocumentPayload} />;
    }
  };

  return (
    <div className="w-full flex flex-col chat-animation">
      <div className="w-full flex justify-end items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-secondary"
        >
          <IoClose size={16} />
        </Button>
      </div>
      {renderResult()}
    </div>
  );
};

export default RenderDisplayView;
