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
      size="sm"
      onClick={onSave}
      disabled={saving}
      className={
        hasChanges
          ? "bg-accent hover:bg-accent/90 text-accent-foreground"
          : "bg-background_alt hover:bg-background_alt/90 text-secondary-foreground"
      }
    >
      {saveText}
    </Button>
    <Button
      size="sm"
      variant="ghost"
      onClick={onCancel}
      className="text-error hover:text-error hover:bg-error/10"
    >
      {cancelText}
    </Button>
  </div>
);

export default SaveCancelButtons;
