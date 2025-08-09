"use client";

import React, { useContext } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ToastContext } from "../contexts/ToastContext";

const ConfirmationModal: React.FC = () => {
  const {
    isConfirmModalOpen,
    confirmModalTitle,
    confirmModalDescription,
    handleConfirmModal,
    handleCancelModal,
  } = useContext(ToastContext);

  return (
    <AlertDialog open={isConfirmModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmModalTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmModalDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelModal}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmModal}
            className="bg-error/10 text-error border border-error hover:bg-error/20"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
