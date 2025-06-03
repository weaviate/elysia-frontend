"use client";

import React from "react";
import {
  DocumentPayload,
  ThreadPayload,
  TicketPayload,
} from "@/app/types/displays";
import { Button } from "@/components/ui/button";
import TicketView from "./TicketView";
import { IoClose } from "react-icons/io5";
import { ProductPayload } from "@/app/types/displays";
import ProductView from "./ProductView";
import ThreadView from "./ThreadView";
import DocumentView from "./DocumentView";

interface ResultViewProps {
  payload: any;
  type: string;
  handleViewChange: (view: "chat" | "code" | "result", payload: any) => void;
}

const ResultView: React.FC<ResultViewProps> = ({
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

export default ResultView;
