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
import { motion, AnimatePresence } from "framer-motion";
import { getObject } from "@/app/api/getObject";
import { SessionContext } from "../contexts/SessionContext";
import { CollectionDataPayload } from "@/app/types/payloads";
import DataCell from "@/app/components/explorer/components/DataCell";
import { ChatContext } from "../contexts/ChatContext";
import { ToastContext } from "../contexts/ToastContext";

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
  const { showErrorToast } = useContext(ToastContext);
  const [showRawData, setShowRawData] = useState(false);
  const { currentCollectionName } = useContext(ChatContext);
  const { id } = useContext(SessionContext);

  const [data, setData] = useState<CollectionDataPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRawButtonHovered, setIsRawButtonHovered] = useState(false);
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);

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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    if (!id || !payload.uuid || !currentCollectionName) return;
    const data = await getObject(id, currentCollectionName, payload.uuid);
    if (data.error) {
      showErrorToast("Error fetching data", data.error);
    } else {
      setData(data);
    }
    setLoading(false);
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
      <motion.div
        className="w-full flex gap-2 justify-end items-center mb-4"
        initial={{ y: 20, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          delay: 0.1,
        }}
      >
        {currentCollectionName && payload.uuid && (
          <motion.div
            onHoverStart={() => setIsRawButtonHovered(true)}
            onHoverEnd={() => setIsRawButtonHovered(false)}
            initial={{ width: "2.5rem", y: 15, opacity: 0 }}
            animate={{
              width: isRawButtonHovered ? "auto" : "2.5rem",
              y: 0,
              opacity: 1,
            }}
            transition={{
              width: { duration: 0.3, ease: "easeInOut" },
              y: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 },
              opacity: { duration: 0.2, delay: 0.2 },
            }}
            className="overflow-hidden"
          >
            <Button
              className={`h-8 rounded-md flex items-center gap-2 px-2 whitespace-nowrap transition-colors duration-200 ${
                isRawButtonHovered
                  ? "bg-alt_color_b/10 hover:bg-alt_color_b/20 text-alt_color_b border border-alt_color_b"
                  : "bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30"
              }`}
              onClick={toggleRawData}
            >
              <MdOutlineDataArray
                size={12}
                className={`flex-shrink-0 transition-colors duration-200 ${
                  isRawButtonHovered ? "text-alt_color_b" : "text-secondary"
                }`}
              />
              <AnimatePresence>
                {isRawButtonHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="text-alt_color_b text-xs"
                  >
                    {showRawData ? "Show display" : "Show raw"}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        )}
        <motion.div
          onHoverStart={() => setIsCloseButtonHovered(true)}
          onHoverEnd={() => setIsCloseButtonHovered(false)}
          initial={{ width: "2.5rem", y: 15, opacity: 0 }}
          animate={{
            width: isCloseButtonHovered ? "auto" : "2.5rem",
            y: 0,
            opacity: 1,
          }}
          transition={{
            width: { duration: 0.3, ease: "easeInOut" },
            y: { type: "spring", stiffness: 300, damping: 20, delay: 0.3 },
            opacity: { duration: 0.2, delay: 0.3 },
          }}
          className="overflow-hidden"
        >
          <Button
            variant="ghost"
            onClick={onClose}
            className={`h-8 rounded-md flex items-center gap-2 px-2 whitespace-nowrap transition-colors duration-200 ${
              isCloseButtonHovered
                ? "bg-error/10 hover:bg-error/20 text-error border border-error"
                : "bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30"
            }`}
          >
            <IoClose
              size={12}
              className={`flex-shrink-0 transition-colors duration-200 ${
                isCloseButtonHovered ? "text-error" : "text-secondary"
              }`}
            />
            <AnimatePresence>
              {isCloseButtonHovered && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="text-error text-xs"
                >
                  Back to chat
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>
      {loading && (
        <div className="w-full flex flex-col">
          <p className="text-secondary shine">Loading...</p>
        </div>
      )}
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
