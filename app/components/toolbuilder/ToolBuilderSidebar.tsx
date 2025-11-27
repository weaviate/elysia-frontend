import { useContext } from "react";
import { TreeContext } from "../contexts/TreeContext";
import ToolButton from "./ToolButton";
import { Separator } from "@/components/ui/separator";
import SettingCombobox from "../configuration/SettingCombobox";
import ToolSidebarButton from "./ToolSidebarButton";
import { LuGitPullRequestCreateArrow } from "react-icons/lu";
import { ToolMetadata } from "@/app/types/objects";
const ToolBuilderSidebar = () => {
  const { toolMetadata, toolPresets, selectToolPreset, selectedToolPreset } =
    useContext(TreeContext);

  const handleSelectToolPreset = (name: string) => {
    const id = toolPresets.find((preset) => preset.name === name)?.id;
    if (id) {
      selectToolPreset(id);
    }
  };

  const openLinkToDocs = () => {
    window.open("https://weaviate.github.io/elysia/creating_tools/", "_blank");
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
      <div className="flex flex-col items-center justify-center gap-2 w-full">
        <ToolButton
          key={"Branch_Creation"}
          metadata={
            {
              name: "Create Branch",
              description:
                "Connect this branch to the next tool or branch in the tree. Write an instruction to determine what next step to take.",
              end: false,
              inputs: {},
            } as ToolMetadata
          }
          is_branch={true}
        />
        <ToolSidebarButton
          onClick={openLinkToDocs}
          icon={<LuGitPullRequestCreateArrow />}
          label="Create New Tool"
        />
      </div>
      <Separator />
      <div className="flex items-center justify-center w-full gap-2 text-secondary text-sm">
        <p>Available Tools ({Object.keys(toolMetadata).length}) </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        {Object.entries(toolMetadata)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([key, value]) => (
            <ToolButton key={key} metadata={value} is_branch={false} />
          ))}
      </div>
    </div>
  );
};

export default ToolBuilderSidebar;
