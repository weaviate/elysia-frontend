import React from "react";
import { Button } from "@/components/ui/button";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import SaveCancelButtons from "./SaveCancelButtons";

interface NamedVectorsEditorProps {
  namedVectors: Record<string, any>;
  editing: boolean;
  namedVectorsDraft: Record<string, any>;
  saving: boolean;
  hasChanges: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDescriptionChange: (key: string, value: string) => void;
}

const NamedVectorsEditor: React.FC<NamedVectorsEditorProps> = ({
  namedVectors,
  editing,
  namedVectorsDraft,
  saving,
  hasChanges,
  onEdit,
  onSave,
  onCancel,
  onDescriptionChange,
}) => {
  if (!namedVectors || Object.keys(namedVectors).length === 0) return null;
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row items-center gap-2">
        <p className="font-bold">Named Vectors</p>
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
      <div className="flex flex-row gap-2 flex-wrap">
        {Object.keys(namedVectors).map((key) => {
          const namedVector = namedVectors[key];
          return (
            <div
              key={key}
              className="flex flex-col gap-2 bg-background_alt rounded-md p-4 w-full lg:w-1/3"
            >
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-2 items-center">
                  <p className="text-secondary text-sm font-light text-wrap">
                    {namedVector?.enabled ? (
                      <FaCheck className="text-accent" />
                    ) : (
                      <FaTimes className="text-error" />
                    )}
                  </p>
                  <p className="font-bold">{key}</p>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <p className="text-primary text-sm font-bold">Description:</p>
                {editing ? (
                  <div className="flex flex-col gap-2 w-full">
                    <textarea
                      className="w-full border rounded p-2 bg-background text-sm"
                      rows={3}
                      value={namedVectorsDraft[key]?.description || ""}
                      onChange={(e) => onDescriptionChange(key, e.target.value)}
                      disabled={saving}
                      placeholder="Enter description..."
                    />
                  </div>
                ) : (
                  <p className="text-secondary text-sm font-light text-wrap">
                    {namedVector?.description || "No description"}
                  </p>
                )}
              </div>
              <div className="flex flex-row gap-2">
                <p className="text-primary text-sm font-bold">
                  Source Properties:
                </p>
                <p className="text-secondary text-sm font-light text-wrap">
                  {namedVector?.source_properties?.join(", ") ||
                    "No source properties"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {editing && (
        <SaveCancelButtons
          saving={saving}
          hasChanges={hasChanges}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};

export default NamedVectorsEditor;
