import React from "react";
import { Button } from "@/components/ui/button";

interface SaveCancelButtonsProps {
  saving: boolean;
  hasChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
  saveText?: string;
  cancelText?: string;
}

const SaveCancelButtons: React.FC<SaveCancelButtonsProps> = ({
  saving,
  hasChanges,
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
}) => (
  <div className="flex gap-2 justify-end mt-2">
    <Button
      onClick={onSave}
      disabled={saving}
      className={
        hasChanges
          ? "bg-accent/10 text-accent border border-accent hover:bg-accent/90"
          : "bg-background_alt text-secondary hover:bg-background_alt/90"
      }
    >
      {saveText}
    </Button>
    <Button
      variant="ghost"
      onClick={onCancel}
      className="text-error hover:text-error hover:bg-error/20 bg-error/10 border border-error"
    >
      {cancelText}
    </Button>
  </div>
);

export default SaveCancelButtons;
