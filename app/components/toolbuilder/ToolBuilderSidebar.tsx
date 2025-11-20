import { useContext } from "react";
import { TreeContext } from "../contexts/TreeContext";
import ToolButton from "./ToolButton";
import { Separator } from "@/components/ui/separator";
import SettingCombobox from "../configuration/SettingCombobox";
import { motion } from "framer-motion";
import { IoMdRefresh } from "react-icons/io";

const ToolBuilderSidebar = () => {
  const { toolMetadata, toolPresets, selectToolPreset, selectedToolPreset } =
    useContext(TreeContext);

  const handleSelectToolPreset = (preset_name: string) => {
    const preset = toolPresets.find((preset) => preset.name === preset_name);
    if (preset) {
      selectToolPreset(preset.preset_id);
    }
  };

  return (
    <div className="flex flex-col w-[300px] h-full justify-start items-start bg-background_alt/50 p-6 gap-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-xl font-bold">Welcome to the Tree Builder!</p>
        <p className="text-secondary text-sm">
          Drag and drop tools to build your agentic tree. Save combinations as
          presets for use in conversations.
        </p>
      </div>
      <div className="w-full flex items-center justify-center">
        <SettingCombobox
          value={selectedToolPreset?.name || "No Preset Selected"}
          values={toolPresets.map((preset) => preset.name)}
          onChange={handleSelectToolPreset}
        />
      </div>
      <Separator />
      <div className="flex items-center justify-center w-full gap-2 text-secondary text-sm">
        <p>Available Tools ({Object.keys(toolMetadata).length}) </p>
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 0.9, rotate: 0 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
        >
          <IoMdRefresh size={10} />
        </motion.button>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        {Object.entries(toolMetadata)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([key, value]) => (
            <ToolButton key={key} metadata={value} />
          ))}
      </div>
    </div>
  );
};

export default ToolBuilderSidebar;
