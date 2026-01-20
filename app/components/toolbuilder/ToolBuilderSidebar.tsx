import { useContext } from "react";
import { TreeContext } from "../contexts/TreeContext";
import ToolButton from "./ToolButton";
import { Separator } from "@/components/ui/separator";
import SettingCombobox from "../configuration/SettingCombobox";
import ToolSidebarButton from "./ToolSidebarButton";
import { LuGitPullRequestCreateArrow } from "react-icons/lu";
import { IoChatbubbleOutline } from "react-icons/io5";
import { ToolMetadata } from "@/app/types/objects";
import { ToastContext } from "../contexts/ToastContext";
import { SessionContext } from "../contexts/SessionContext";
import { ConversationContext } from "../contexts/ConversationContext";
import { RouterContext } from "../contexts/RouterContext";
import { Button } from "@/components/ui/button";
import { PiSidebarSimpleBold } from "react-icons/pi";

interface ToolBuilderSidebarProps {
  onCollapse: () => void;
}

const ToolBuilderSidebar = ({ onCollapse }: ToolBuilderSidebarProps) => {
  const {
    toolMetadata,
    toolPresets,
    selectToolPreset,
    selectedToolPreset,
    unsavedChanges,
    selectPresetId,
  } = useContext(TreeContext);

  const { showConfirmModal } = useContext(ToastContext);
  const { id } = useContext(SessionContext);
  const { addConversation, changePresetID, creatingNewConversation } =
    useContext(ConversationContext);
  const { changePage } = useContext(RouterContext);

  const handleSelectToolPreset = (name: string) => {
    const id = toolPresets.find((preset) => preset.name === name)?.id;
    if (id) {
      selectToolPreset(id);
    }
  };

  const openLinkToDocs = () => {
    window.open("https://weaviate.github.io/elysia/creating_tools/", "_blank");
  };

  const handleToolSelectionChange = (name: string) => {
    if (unsavedChanges) {
      showConfirmModal(
        "Unsaved Changes",
        "You have unsaved changes in your tree. Are you sure you want to switch to a new preset? You will lose your changes.",
        () => handleSelectToolPreset(name)
      );
    } else {
      handleSelectToolPreset(name);
    }
  };

  const handleCreateConversationWithTree = async () => {
    if (!id || !selectedToolPreset) return;

    const newConversation = await addConversation(id);
    if (newConversation) {
      // Override the preset to use the currently selected one from the tree builder
      changePresetID(newConversation.id, selectedToolPreset.name);
      selectPresetId(selectedToolPreset.name);
      // Navigate to chat page with the new conversation
      changePage("chat", { conversation: newConversation.id }, true);
    }
  };

  return (
    <div className="flex flex-col w-[300px] max-w-[90vw] h-full min-h-0 bg-background_alt/50 p-4 sm:p-6 gap-4 sm:gap-6 overflow-y-auto">
      <div className="flex flex-col items-center justify-center gap-2 shrink-0">
        <div className="flex w-full justify-between items-center">
          <p className="text-lg sm:text-xl font-bold">Tree Builder</p>
          <Button variant="ghost" size="sm" onClick={onCollapse} className="text-secondary hover:text-primary">
            <PiSidebarSimpleBold />
          </Button>
        </div>
        <p className="text-secondary text-xs sm:text-sm text-center">
          Drag and drop tools to build your agentic tree. Save combinations as
          presets for use in conversations.
        </p>
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-2 shrink-0">
        {unsavedChanges && (
          <p className="text-warning text-xs">* You have unsaved changes</p>
        )}
        <SettingCombobox
          value={selectedToolPreset?.name || "No Preset Selected"}
          values={toolPresets.map((preset) => preset.name)}
          onChange={handleToolSelectionChange}
          allowCustom={false}
        />
        <ToolSidebarButton
          onClick={handleCreateConversationWithTree}
          icon={<IoChatbubbleOutline />}
          label="Create new Conversation"
          disabled={creatingNewConversation || !selectedToolPreset || unsavedChanges}
        />
      </div>
      <Separator className="shrink-0" />
      <div className="flex flex-col items-center justify-center gap-2 w-full shrink-0">
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
      <Separator className="shrink-0" />
      <div className="flex items-center justify-center w-full gap-2 text-secondary text-xs sm:text-sm shrink-0">
        <p>Available Tools ({Object.keys(toolMetadata).length}) </p>
      </div>
      <div className="flex flex-col items-center justify-start gap-3 min-h-0 overflow-y-auto">
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
