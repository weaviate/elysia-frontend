"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ViewEnvironmentPayload } from "@/app/types/chat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoClose } from "react-icons/io5";
import { TbEye } from "react-icons/tb";
import DataTable from "../explorer/DataTable";

interface ViewEnvironmentEntryProps {
  payload: ViewEnvironmentPayload;
  isLast?: boolean;
}

const pulseVariants = {
  animate: {
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// Infer field types from data for DataTable header
const inferFieldTypes = (data: { [key: string]: unknown }[]): { [key: string]: string } => {
  const header: { [key: string]: string } = {};
  
  if (!data || data.length === 0) return header;
  
  // Get all unique keys
  const allKeys = new Set<string>();
  data.forEach((item) => Object.keys(item).forEach((key) => allKeys.add(key)));
  
  // Infer type from first non-null value for each key
  allKeys.forEach((key) => {
    for (const item of data) {
      const value = item[key];
      if (value !== null && value !== undefined) {
        if (typeof value === "boolean") {
          header[key] = "boolean";
        } else if (typeof value === "number") {
          header[key] = "number";
        } else if (Array.isArray(value)) {
          header[key] = typeof value[0] === "object" ? "object[]" : "text[]";
        } else if (typeof value === "object") {
          header[key] = "object";
        } else {
          header[key] = "text";
        }
        break;
      }
    }
    // Default to text if all values are null/undefined
    if (!header[key]) {
      header[key] = "text";
    }
  });
  
  return header;
};

const ViewEnvironmentEntry = ({ payload, isLast = false }: ViewEnvironmentEntryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const itemCount = payload.environment_preview?.length ?? 0;
  const displayText = itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""} viewed` : "Viewing environment";

  // Memoize header inference
  const header = useMemo(() => 
    inferFieldTypes(payload.environment_preview ?? []),
    [payload.environment_preview]
  );

  return (
    <>
      <div className="py-1.5">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="inline-flex justify-center items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 border border-accent/30 w-full cursor-pointer hover:bg-accent/20 transition-colors"
          variants={isLast ? pulseVariants : undefined}
          animate={isLast ? "animate" : undefined}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <TbEye className="text-accent text-xs" />
          <span className="text-[11px] font-bold text-accent">
            {displayText}
          </span>
        </motion.button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col bg-background/80 backdrop-blur-xl border-foreground/10 shadow-2xl p-0 overflow-hidden [&>button]:hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col"
          >
            {/* Header */}
            <DialogHeader className="p-6 pb-4 border-b border-foreground/10 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    <TbEye className="text-accent text-lg" />
                  </motion.div>
                  <div>
                    <DialogTitle className="text-primary text-lg font-semibold">
                      Environment Preview
                    </DialogTitle>
                    {payload.tool_name && (
                      <p className="text-xs text-secondary mt-0.5">
                        Tool: <span className="text-accent">{payload.tool_name}</span>
                        {payload.metadata_key && (
                          <> · Key: <span className="text-accent">{payload.metadata_key}</span></>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-foreground/10 transition-colors text-secondary hover:text-primary"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoClose size={18} />
                </motion.button>
              </div>
            </DialogHeader>

            {/* Scrollable Content Area */}
            <motion.div
              className="overflow-y-auto overflow-x-auto p-6 pt-4"
              style={{ maxHeight: "calc(80vh - 140px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {itemCount === 0 ? (
                <div className="flex items-center justify-center py-12 text-secondary rounded-lg border border-foreground/10">
                  <p className="text-sm">No environment data available</p>
                </div>
              ) : (
                <div className="rounded-lg border border-foreground/10 overflow-hidden">
                  <DataTable
                    data={payload.environment_preview}
                    header={header}
                    stickyHeaders={false}
                    disableCellSelection={true}
                  />
                </div>
              )}
            </motion.div>

            {/* Footer */}
            {itemCount > 0 && (
              <motion.div
                className="px-6 py-3 flex justify-between items-center text-xs text-secondary border-t border-foreground/10 flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span>{itemCount} item{itemCount > 1 ? "s" : ""}</span>
                <span>{Object.keys(header).length} column{Object.keys(header).length > 1 ? "s" : ""}</span>
              </motion.div>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewEnvironmentEntry;
