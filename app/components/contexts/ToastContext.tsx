"use client";

import { Collection } from "@/app/types/objects";
import { createContext, useEffect, useRef, useState, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import { ToastAction } from "@/components/ui/toast";
import { Toast } from "@/app/types/objects";
import { MdContentCopy } from "react-icons/md";
import { IoCheckmarkOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

// Component for error toast actions with copy and close buttons
const ErrorToastActions: React.FC<{ errorText: string }> = ({ errorText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error text:", err);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleCopy}
        variant="ghost"
        size="sm"
        className="h-8 shrink-0 px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
        title="Copy error to clipboard"
      >
        {copied ? (
          <IoCheckmarkOutline className="h-4 w-4" />
        ) : (
          <MdContentCopy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export const ToastContext = createContext<{
  analyzeCollection: (
    collection: Collection,
    user_id: string,
    socket: WebSocket
  ) => void;
  currentToasts: Toast[];
  showErrorToast: (title: string, description?: string) => void;
  showSuccessToast: (title: string, description?: string) => void;
  showWarningToast: (title: string, description?: string) => void;
  finishProcessingSocket: (collection_name: string, error: string) => void;
  updateProcessingSocket: (
    collection_name: string,
    progress: number,
    message: string
  ) => void;
  // Confirmation Modal
  isConfirmModalOpen: boolean;
  confirmModalTitle: string;
  confirmModalDescription: string;
  showConfirmModal: (
    title: string,
    description: string,
    onConfirm: () => void
  ) => void;
  handleConfirmModal: () => void;
  handleCancelModal: () => void;
}>({
  analyzeCollection: () => {},
  currentToasts: [],
  showErrorToast: () => {},
  showSuccessToast: () => {},
  showWarningToast: () => {},
  finishProcessingSocket: () => {},
  updateProcessingSocket: () => {},
  // Confirmation Modal
  isConfirmModalOpen: false,
  confirmModalTitle: "",
  confirmModalDescription: "",
  showConfirmModal: () => {},
  handleConfirmModal: () => {},
  handleCancelModal: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout>();

  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalDescription, setConfirmModalDescription] = useState("");
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(
    null
  );

  // Helper function to format elapsed time
  const formatElapsedTime = (startTime: number): string => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const showErrorToast = useCallback(
    (title: string, description?: string) => {
      const errorText = description || "An error occurred. Please try again.";
      const fullErrorText = `${title}: ${errorText}`;

      toast({
        title,
        description: errorText,
        variant: "destructive",
        action: <ErrorToastActions errorText={fullErrorText} />,
      });
    },
    [toast]
  );

  const showSuccessToast = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: "default",
      });
    },
    [toast]
  );

  const showWarningToast = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description: description || "Please review this warning.",
        variant: "warning",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
    },
    [toast]
  );

  // Confirmation Modal Methods
  const showConfirmModal = useCallback(
    (title: string, description: string, onConfirm: () => void) => {
      setConfirmModalTitle(title);
      setConfirmModalDescription(description);
      setPendingCallback(() => onConfirm);
      setIsConfirmModalOpen(true);
    },
    []
  );

  const handleConfirmModal = useCallback(() => {
    if (pendingCallback) {
      pendingCallback();
    }
    setIsConfirmModalOpen(false);
    setConfirmModalTitle("");
    setConfirmModalDescription("");
    setPendingCallback(null);
  }, [pendingCallback]);

  const handleCancelModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setConfirmModalTitle("");
    setConfirmModalDescription("");
    setPendingCallback(null);
  }, []);

  const analyzeCollection = useCallback(
    (collection: Collection, user_id: string, socket: WebSocket) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Starting analysis of " + collection.name + "...");
      }

      const isProcessing = currentToasts.some(
        (toast) => toast.collection_name === collection.name
      );

      if (isProcessing) {
        setTimeout(() => {
          toast({
            title: "Already analyzing " + collection.name + "...",
            description: "Please wait for it to finish before analyzing again.",
          });
        }, 0);
        return;
      }

      setTimeout(() => {
        const startTime = Date.now();
        const _toast = toast({
          title: "0% - Starting analysis of " + collection.name + "...",
          description: "Connecting to server... (0s)",
          progress: 0,
          duration: 1000000,
        });

        setCurrentToasts((prev) => {
          const newToasts = [
            ...prev,
            {
              collection_name: collection.name,
              toast: _toast,
              progress: 0,
              startTime: startTime, // Add start time
              currentMessage: "Connecting to server...", // Initial message
            },
          ];

          if (socket && user_id) {
            const payload = {
              user_id: user_id,
              collection_name: collection.name,
            };
            socket.send(JSON.stringify(payload));
          } else {
            showErrorToast(
              "Error analyzing " + collection.name + "...",
              "Connection to Elysia lost (Socket: " +
                socket +
                ") (ID: " +
                user_id +
                ")"
            );
            setCurrentToasts((prev) =>
              prev.filter((toast) => toast.collection_name !== collection.name)
            );
            return prev;
          }

          return newToasts;
        });
      }, 0);
    },
    [currentToasts, toast]
  );

  const updateProcessingSocket = (
    collection_name: string,
    progress: number,
    message: string
  ) => {
    setCurrentToasts((prev) => {
      const currentToast = prev.find(
        (toast) => toast.collection_name === collection_name
      );

      if (!currentToast) {
        return prev;
      }

      const newProgress = Number((progress * 100).toFixed(2));
      const elapsedTime = formatElapsedTime(currentToast.startTime);

      currentToast.toast.update({
        id: currentToast.toast.id,
        title: `${Math.round(newProgress)}% - Analyzing ${currentToast.collection_name}...`,
        description: `${message} (${elapsedTime})`,
        progress: newProgress,
      });

      // Return updated array with the new progress and message
      return prev.map((toast) =>
        toast.collection_name === collection_name
          ? { ...toast, progress: newProgress, currentMessage: message }
          : toast
      );
    });
  };

  const finishProcessingSocket = (collection_name: string, error: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Finished analysis of " + collection_name + " with error: " + error
      );
    }
    setCurrentToasts((prev) => {
      const currentToast = prev.find(
        (toast) => toast.collection_name === collection_name
      );

      if (!currentToast) {
        return prev;
      }

      const finalElapsedTime = formatElapsedTime(currentToast.startTime);

      if (error) {
        const errorDescription = `${error} (Total time: ${finalElapsedTime})`;
        const fullErrorText = `Error analyzing ${currentToast.collection_name}: ${errorDescription}`;

        currentToast.toast.update({
          id: currentToast.toast.id,
          title: `100% - Error analyzing ${currentToast.collection_name}...`,
          variant: "destructive",
          description: errorDescription,
          progress: 100,
          action: <ErrorToastActions errorText={fullErrorText} />,
        });
      } else {
        currentToast.toast.update({
          id: currentToast.toast.id,
          title: `100% - Done!`,
          description: `Collection analyzed successfully (Total time: ${finalElapsedTime})`,
          progress: 100,
          action: (
            <ToastAction
              altText="Close"
              onClick={() => currentToast.toast.dismiss()}
            >
              Close
            </ToastAction>
          ),
        });
      }
      return prev.filter((toast) => toast.collection_name !== collection_name);
    });
  };

  // Timer effect to update elapsed time every second
  useEffect(() => {
    if (currentToasts.length > 0) {
      timerIntervalRef.current = setInterval(() => {
        setCurrentToasts((prev) => {
          let hasUpdates = false;
          const updatedToasts = prev.map((toastItem) => {
            // Only update if progress is less than 100 (still processing)
            if (toastItem.progress < 100) {
              const elapsedTime = formatElapsedTime(toastItem.startTime);
              toastItem.toast.update({
                id: toastItem.toast.id,
                title: `${Math.round(toastItem.progress)}% - Analyzing ${toastItem.collection_name}...`,
                description: `${toastItem.currentMessage} (${elapsedTime})`,
                progress: toastItem.progress,
              });
              hasUpdates = true;
            }
            return toastItem;
          });
          return hasUpdates ? updatedToasts : prev;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentToasts.length]);

  return (
    <ToastContext.Provider
      value={{
        analyzeCollection,
        currentToasts,
        showErrorToast,
        showSuccessToast,
        showWarningToast,
        finishProcessingSocket,
        updateProcessingSocket,
        // Confirmation Modal
        isConfirmModalOpen,
        confirmModalTitle,
        confirmModalDescription,
        showConfirmModal,
        handleConfirmModal,
        handleCancelModal,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
