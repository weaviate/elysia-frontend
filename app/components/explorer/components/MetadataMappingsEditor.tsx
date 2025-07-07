import React from "react";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaLongArrowAltRight, FaPlus } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDisplayIcon } from "@/app/types/displayIcons";
import SaveCancelButtons from "./SaveCancelButtons";
import DisplayTypeSelect from "./DisplayTypeSelect";

interface MetadataMappingsEditorProps {
  editing: boolean;
  mappingsDraft: Record<string, Record<string, string>>;
  mappingTypes: Record<string, Record<string, string>>;
  metadataRows: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddGroup: (
    type: string,
    mappingTypes: Record<string, Record<string, string>>,
  ) => void;
  onRemoveGroup: (group: string) => void;
  onMappingChange: (group: string, subkey: string, value: string) => void;
  saving: boolean;
  hasChanges: boolean;
  currentMappings: Record<string, any>;
}

const MetadataMappingsEditor: React.FC<MetadataMappingsEditorProps> = ({
  editing,
  mappingsDraft,
  mappingTypes,
  metadataRows,
  onEdit,
  onSave,
  onCancel,
  onAddGroup,
  onRemoveGroup,
  onMappingChange,
  saving,
  hasChanges,
  currentMappings,
}) => (
  <div className="flex flex-col gap-2 w-full mb-10">
    <div className="flex flex-row items-center gap-2">
      <p className="font-bold">Display Mappings</p>
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
      {editing && (
        <DisplayTypeSelect
          mappingTypes={mappingTypes}
          onSelect={(value) => onAddGroup(value, mappingTypes)}
        />
      )}
    </div>
    <div className="flex flex-row gap-4">
      {editing ? (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col lg:flex-row gap-10">
            {Object.keys(mappingsDraft).map((group) => (
              <div
                key={group}
                className="flex flex-col gap-2 bg-background rounded-md p-2"
              >
                <div className="flex flex-row items-center gap-2">
                  <div className="flex flex-row items-center gap-3 flex-1">
                    {getDisplayIcon(group || "")}
                    <p className="font-bold text-primary text-lg">
                      {group.replace(/_/g, " ")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveGroup(group)}
                    className="text-error"
                  >
                    <FaTrash />
                  </Button>
                </div>
                <div className="flex flex-col gap-1">
                  {(Object.keys(mappingTypes[group] || {}) as string[]).map(
                    (subkey: string) => (
                      <div
                        key={subkey}
                        className="flex flex-row gap-2 items-center"
                      >
                        <p className="w-[100px] md:w-[150px] truncate text-sm md:text-base font-medium">
                          {subkey}
                        </p>
                        <FaLongArrowAltRight />
                        <Select
                          value={mappingsDraft[group][subkey] || "none"}
                          onValueChange={(value) =>
                            onMappingChange(
                              group,
                              subkey,
                              value === "none" ? "" : value,
                            )
                          }
                        >
                          <SelectTrigger className="w-[100px] md:w-[150px] h-8 border-background_alt bg-background_alt">
                            <SelectValue
                              placeholder="Select field"
                              className="text-primary"
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-background_alt border-background_alt">
                            <SelectItem
                              value="none"
                              className="text-primary focus:bg-primary/20 focus:text-primary data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                            >
                              (empty)
                            </SelectItem>
                            {Object.keys(metadataRows.properties).map(
                              (field) => (
                                <SelectItem
                                  key={field}
                                  value={field}
                                  className="text-primary focus:bg-primary/20 focus:text-primary data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                                >
                                  {field}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
          <SaveCancelButtons
            saving={saving}
            hasChanges={hasChanges}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>
      ) : (
        Object.keys(currentMappings || {}).map((key) => {
          const mappings = currentMappings[key] || {};
          const totalMappings = Object.keys(mappings).length;
          const matchingMappings = Object.values(mappings).filter(
            (value: any) => value && value.length > 0,
          ).length;
          const displayLabel = key;
          return (
            <div
              key={key}
              className="flex flex-col gap-4 w-fit h-fit p-3 bg-background_alt rounded-md mb-5"
            >
              <div className="flex flex-row gap-2 items-center">
                {getDisplayIcon(key || "")}
                <p className="font-bold text-sm md:text-base">{displayLabel}</p>
                <p className="text-secondary">
                  ({matchingMappings}/{totalMappings})
                </p>
              </div>
              <div>
                {Object.keys(mappings).map((subkey) => (
                  <div
                    key={subkey}
                    className="flex flex-row gap-2 items-center"
                  >
                    <p
                      className={`w-[100px] md:w-[150px] truncate text-sm md:text-base font-medium ${!mappings[subkey] ? "text-secondary" : ""}`}
                    >
                      {subkey}
                    </p>
                    <FaLongArrowAltRight
                      className={`${!mappings[subkey] ? "text-secondary" : "text-primary"}`}
                    />
                    <p
                      className={`truncate text-sm md:text-base ${!mappings[subkey] ? "text-secondary" : ""}`}
                    >
                      {mappings[subkey] || "(empty)"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
    <Separator />
  </div>
);

export default MetadataMappingsEditor;
