import React from "react";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaLongArrowAltRight } from "react-icons/fa";
import { MdDisplaySettings } from "react-icons/md";
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
  mappingTypeDescriptions: Record<string, string>;
  collectionDataProperties: { [key: string]: string };
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddGroup: (
    type: string,
    mappingTypes: Record<string, Record<string, string>>
  ) => void;
  onRemoveGroup: (group: string) => void;
  onMappingChange: (group: string, subkey: string, value: string) => void;
  saving: boolean;
  hasChanges: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentMappings: Record<string, any>;
}

const MetadataMappingsEditor: React.FC<MetadataMappingsEditorProps> = ({
  editing,
  mappingsDraft,
  mappingTypes,
  mappingTypeDescriptions,
  collectionDataProperties,
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
  <div className="flex flex-col gap-2 border border-foreground p-4 rounded-md">
    <div className="flex flex-row items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-highlight/10 border border-highlight rounded-md p-1">
          <MdDisplaySettings className="text-highlight" />
        </div>
        <p className="font-bold">Display Mappings</p>
      </div>
      {!editing && (
        <Button onClick={onEdit} className="">
          <FaEdit className="text-secondary" />
          <p className="text-secondary">Edit</p>
        </Button>
      )}
      {editing && (
        <DisplayTypeSelect
          mappingTypes={mappingTypes}
          mappingTypeDescriptions={mappingTypeDescriptions}
          onSelect={(value) => onAddGroup(value, mappingTypes)}
        />
      )}
    </div>
    <div className="w-full">
      {editing ? (
        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {Object.keys(mappingsDraft).map((group) => (
              <div
                key={group}
                className="flex flex-col gap-2 bg-background rounded-lg p-4 border border-border shadow-sm h-fit"
              >
                <div className="flex flex-row items-center gap-2">
                  <div className="flex flex-row items-center gap-3 flex-1">
                    {getDisplayIcon(group || "")}
                    <p className="font-bold text-primary text-lg">
                      {group.replace(/_/g, " ")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => onRemoveGroup(group)}
                    className="text-error bg-error/10 border border-error w-8 h-8 hover:bg-error/20 hover:text-error"
                  >
                    <FaTrash size={16} />
                  </Button>
                </div>
                <div className="flex flex-col gap-1 h-48 overflow-y-auto">
                  {/* Headers */}
                  <div className="flex flex-row gap-2 items-center mb-2 border-b border-border pb-1 sticky top-0 bg-background z-10">
                    <p className="w-[120px] md:w-[150px] text-xs font-semibold text-secondary uppercase tracking-wide">
                      Data Field
                    </p>
                    <div className="w-[24px]"></div> {/* Space for arrow */}
                    <p className="w-[120px] md:w-[150px] text-xs font-semibold text-secondary uppercase tracking-wide">
                      Display Field
                    </p>
                  </div>

                  {(Object.keys(mappingTypes[group] || {}) as string[]).map(
                    (subkey: string) => (
                      <div
                        key={subkey}
                        className="flex flex-row gap-2 items-center"
                      >
                        <Select
                          value={mappingsDraft[group][subkey] || "none"}
                          onValueChange={(value) =>
                            onMappingChange(
                              group,
                              subkey,
                              value === "none" ? "" : value
                            )
                          }
                        >
                          <SelectTrigger className="w-[120px] md:w-[150px] h-8 border-background_alt bg-background_alt">
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
                            {Object.keys(collectionDataProperties).map(
                              (field) => (
                                <SelectItem
                                  key={field}
                                  value={field}
                                  className="text-primary focus:bg-primary/20 focus:text-primary data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                                >
                                  {field}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FaLongArrowAltRight className="w-[24px] flex justify-center" />
                        <p className="w-[120px] md:w-[150px] truncate text-sm md:text-base font-medium">
                          {subkey}
                        </p>
                      </div>
                    )
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 w-full">
          {Object.keys(currentMappings || {}).map((key) => {
            const mappings = currentMappings[key] || {};
            const totalMappings = Object.keys(mappings).length;
            const matchingMappings = Object.values(mappings).filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (value: any) => value && value.length > 0
            ).length;
            const displayLabel = key;
            return (
              <div
                key={key}
                className="flex flex-col gap-3 p-4 bg-background_alt rounded-lg border border-border shadow-sm"
              >
                <div className="flex flex-row gap-3 items-center justify-between">
                  <div className="flex flex-row gap-2 items-center flex-1 min-w-0">
                    {getDisplayIcon(key || "")}
                    <p className="font-bold text-sm md:text-base truncate">
                      {displayLabel}
                    </p>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-full px-2 py-1">
                    <p className="text-xs text-primary font-medium">
                      {matchingMappings}/{totalMappings}
                    </p>
                  </div>
                </div>
                <div className="h-48 overflow-y-auto">
                  {/* Headers for read-only view */}
                  <div className="flex flex-row gap-2 items-center mb-2 border-b border-border pb-1 sticky top-0 bg-background_alt z-10">
                    <p className="w-[120px] md:w-[150px] text-xs font-semibold text-secondary uppercase tracking-wide">
                      Data Field
                    </p>
                    <div className="w-[24px]"></div> {/* Space for arrow */}
                    <p className="w-[120px] md:w-[150px] text-xs font-semibold text-secondary uppercase tracking-wide">
                      Display Field
                    </p>
                  </div>

                  {Object.keys(mappings).map((subkey) => (
                    <div
                      key={subkey}
                      className="flex flex-row gap-2 items-center"
                    >
                      <p
                        className={`w-[120px] md:w-[150px] truncate text-sm md:text-base ${!mappings[subkey] ? "text-secondary" : ""}`}
                      >
                        {mappings[subkey] || "(empty)"}
                      </p>
                      <FaLongArrowAltRight
                        className={`w-[24px] flex justify-center ${!mappings[subkey] ? "text-secondary" : "text-primary"}`}
                      />
                      <p
                        className={`w-[120px] md:w-[150px] truncate text-sm md:text-base font-medium ${!mappings[subkey] ? "text-secondary" : ""}`}
                      >
                        {subkey}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

export default MetadataMappingsEditor;
