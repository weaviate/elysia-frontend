"use client";

import React, { useContext, useEffect, useState } from "react";
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

import { MdOutlineDataArray } from "react-icons/md";
import { getObject } from "@/app/api/getObject";
import { SessionContext } from "../contexts/SessionContext";
import { CollectionDataPayload } from "@/app/types/payloads";
import DataCell from "@/app/components/explorer/components/DataCell";
import { ChatContext } from "../contexts/ChatContext";

interface RenderDisplayViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleViewChange: (view: "chat" | "code" | "result", payload: any) => void;
}

const RenderDisplayView: React.FC<RenderDisplayViewProps> = ({
  payload,
  type,
  handleViewChange,
}) => {
  const [showRawData, setShowRawData] = useState(false);
  const { currentCollectionName } = useContext(ChatContext);
  const { id } = useContext(SessionContext);

  const [data, setData] = useState<CollectionDataPayload | null>(null);

  const onClose = () => {
    handleViewChange("chat", null);
  };

  const toggleRawData = () => {
    setShowRawData((prev) => !prev);
  };

  useEffect(() => {
    if (showRawData) {
      fetchData();
    }
  }, [showRawData]);

  const fetchData = async () => {
    if (!id || !payload.uuid || !currentCollectionName) return;
    const data = await getObject(id, currentCollectionName, payload.uuid);
    setData(data);
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
      <div className="w-full flex gap-3 justify-end items-center">
        {showRawData ? (
          <Button variant="default" onClick={toggleRawData}>
            <MdOutlineDataArray size={16} />
            <p>Show display</p>
          </Button>
        ) : (
          <Button variant="default" onClick={toggleRawData}>
            <MdOutlineDataArray size={16} />
            <p>Raw data</p>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-secondary"
        >
          <IoClose size={16} />
        </Button>
      </div>
      {showRawData ? (
        <div className="w-full flex flex-col">
          <DataCell selectedCell={data?.items[0] || null} />
        </div>
      ) : (
        renderResult()
      )}
    </div>
  );
};

export default RenderDisplayView;
