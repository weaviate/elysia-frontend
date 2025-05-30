// app/components/common/FullScreenOverlay.tsx
"use client";

import { IoMdArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

interface FullScreenOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FullScreenOverlay: React.FC<FullScreenOverlayProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  // Create portal to render at document body level
  return createPortal(
    <div className="fade-in fixed inset-0 bg-background z-[100] document-container overflow-y-auto max-h-100vh">
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-background/80 hover:bg-primary/50 hover:text-accent-foreground"
          >
            <IoMdArrowBack className="h-5 w-5" />
          </Button>
        </div>
        <div className="container mx-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default FullScreenOverlay;
