import React from "react";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import MarkdownFormat from "../../chat/components/MarkdownFormat";
import SaveCancelButtons from "./SaveCancelButtons";

interface MetadataSummaryEditorProps {
  summary: string;
  editing: boolean;
  summaryDraft: string;
  saving: boolean;
  hasChanges: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const MetadataSummaryEditor: React.FC<MetadataSummaryEditorProps> = ({
  summary,
  editing,
  summaryDraft,
  saving,
  hasChanges,
  onEdit,
  onChange,
  onSave,
  onCancel,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <p className="font-bold">Summary</p>
      {!editing && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          className="text-secondary hover:text-primary hover:bg-transparent font-normal mr-2"
        >
          <FaEdit />
        </Button>
      )}
    </div>
    {editing ? (
      <div className="flex flex-col gap-2">
        <textarea
          className="w-full border rounded p-2 bg-background_alt min-h-[35vh]"
          rows={4}
          value={summaryDraft}
          onChange={(e) => onChange(e.target.value)}
          disabled={saving}
        />
        <SaveCancelButtons
          saving={saving}
          hasChanges={hasChanges}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    ) : (
      <MarkdownFormat text={summary} />
    )}
  </div>
);

export default MetadataSummaryEditor;
