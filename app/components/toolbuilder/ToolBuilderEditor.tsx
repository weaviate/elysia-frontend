import {
  ReactFlow,
  Background,
  Panel,
  ConnectionLineType,
  ReactFlowInstance,
} from "@xyflow/react";
import { TreeContext } from "../contexts/TreeContext";
import { useContext, useEffect, useRef, useState } from "react";
import { nodeTypes } from "./EditorNodes";
import { Button } from "@/components/ui/button";
import { Connection } from "@xyflow/react";
import "./proximity-edges.css";
import { FaSave } from "react-icons/fa";
import { GrRevert } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { IoMdAdd } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { DeleteButton } from "../navigation/DeleteButton";
import { motion, AnimatePresence } from "framer-motion";
import { MdWarning, MdUndo, MdRedo } from "react-icons/md";
import { ToastContext } from "../contexts/ToastContext";
import { Checkbox } from "@/components/ui/checkbox";
import { PiSidebarSimpleBold } from "react-icons/pi";

interface ToolBuilderEditorProps {
  sidebarCollapsed?: boolean;
  onExpandSidebar?: () => void;
}

const ToolBuilderEditor = ({ sidebarCollapsed = false, onExpandSidebar }: ToolBuilderEditorProps) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
    handleAutoLayout,
    onDragOver,
    onDrop,
    reactFlowWrapper,
    onNodeDrag,
    onNodeDragStop,
    saveTree,
    onNodesDelete,
    currentPresetName,
    updateCurrentPresetName,
    warningMessages,
    selectToolPreset,
    selectedToolPreset,
    canUndo,
    canRedo,
    undo,
    redo,
    unsavedChanges,
    createNewPreset,
    currentDefaultState,
    triggerDefaultState,
    savingTree,
    handleDeleteTreePreset,
  } = useContext(TreeContext);

  const { showConfirmModal } = useContext(ToastContext);

  const handleCreateNewPreset = () => {
    if (unsavedChanges) {
      showConfirmModal(
        "Unsaved Changes",
        "You have unsaved changes in your tree. Are you sure you want to create a new preset? You will lose your changes.",
        () => createNewPreset()
      );
    } else {
      createNewPreset();
    }
  };

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // Track if we've done the initial fit for the current preset
  const hasFitViewRef = useRef(false);

  // Reset the flag when preset changes
  useEffect(() => {
    hasFitViewRef.current = false;
  }, [selectedToolPreset]);

  useEffect(() => {
    // Only fit view once per preset load, not on every node change
    if (reactFlowInstance && nodes.length > 0 && !hasFitViewRef.current) {
      hasFitViewRef.current = true;
      // Delay to ensure nodes are rendered, then fit view with better parameters
      setTimeout(() => {
        reactFlowInstance.fitView({
          duration: 1500,
          minZoom: 0.1,
          maxZoom: 1,
          padding: 0.2, // 20% padding around the tree
        });
      }, 100);
    }
  }, [reactFlowInstance, nodes, selectedToolPreset]);

  return (
    <div
      style={{ width: "100%", height: "100vh" }}
      ref={reactFlowWrapper}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative"
    >
      {/* Responsive Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-2 pointer-events-none">
        {/* Mobile: single wrapped row | Desktop: split left/right */}
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 pointer-events-auto">
          {/* Left group: Sidebar toggle, Input, Create, Delete */}
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
            {/* Expand sidebar button - only visible when collapsed */}
            <AnimatePresence>
              {sidebarCollapsed && onExpandSidebar && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={onExpandSidebar}
                    className="text-secondary hover:text-primary h-8 w-8 md:w-auto md:px-3"
                    title="Open sidebar"
                  >
                    <PiSidebarSimpleBold size={16} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Preset name input */}
            <Input
              className="text-primary text-sm bg-background/10 w-[120px] md:w-[180px] h-8"
              value={currentPresetName}
              onChange={(e) => updateCurrentPresetName(e.target.value)}
              placeholder="Preset name"
              autoFocus
            />
            
            {/* Create/Delete buttons */}
            <Button 
              onClick={handleCreateNewPreset} 
              variant="subtle" 
              size="sm" 
              className="h-8 w-8 md:w-auto md:px-3 text-sm" 
              title="Create new preset"
            >
              <IoMdAdd size={16} />
              <span className="hidden md:inline ml-1">Create</span>
            </Button>
            <DeleteButton
              variant="subtle_cancel"
              classNameDefault="h-8 w-8 md:w-auto md:px-3 p-0 md:p-2 flex items-center justify-center gap-1 text-sm"
              classNameConfirm="h-8 px-2 text-secondary hover:text-error border border-foreground text-sm"
              icon={<TiDelete size={16} />}
              text={<span className="hidden md:inline">Delete</span>}
              confirmText="Sure?"
              onClick={() => handleDeleteTreePreset(selectedToolPreset?.id || "")}
            />
          </div>
          
          {/* Right group: Default, Save, Revert, Layout */}
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
            {/* Default checkbox */}
            <div className="flex items-center gap-1.5">
              <Checkbox
                checked={currentDefaultState}
                onCheckedChange={(checked) => triggerDefaultState((checked as boolean) ?? false)}
              />
              <p className="text-sm text-secondary hidden md:block">Default</p>
            </div>
            
            {/* Save/Revert/Layout buttons - consistent styling */}
            <Button
              onClick={async () => await saveTree()}
              variant="save"
              size="sm"
              className="h-8 w-8 md:w-auto md:px-3 text-sm"
              disabled={!unsavedChanges || savingTree}
              title={savingTree ? "Saving..." : "Save"}
            >
              <FaSave size={14} />
              <span className="hidden md:inline ml-1">{savingTree ? "Saving..." : "Save"}</span>
            </Button>
            <Button
              onClick={() => selectToolPreset(selectedToolPreset?.id || "")}
              variant="cancel"
              size="sm"
              className="h-8 w-8 md:w-auto md:px-3 text-sm"
              disabled={!unsavedChanges || savingTree}
              title="Revert changes"
            >
              <GrRevert size={14} />
              <span className="hidden md:inline ml-1">Revert</span>
            </Button>
            <Button 
              onClick={handleAutoLayout} 
              variant="subtle" 
              size="sm" 
              className="h-8 w-8 md:w-auto md:px-3 text-sm"
              title="Auto layout"
            >
              <LuLayoutDashboard size={14} />
              <span className="hidden md:inline ml-1">Layout</span>
            </Button>
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        colorMode="dark"
        onEdgesChange={onEdgesChange}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        isValidConnection={(edge) => isValidConnection(edge as Connection)}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={[10, 10]}
        connectionLineType={ConnectionLineType.Step}
        noWheelClassName="no-wheel"
        onInit={setReactFlowInstance}
        defaultEdgeOptions={{
          style: { strokeWidth: 2 },
          animated: true,
        }}
        fitView
      >
        <Background gap={20} size={2} color="hsl(var(--foreground))" />

        {/* Validation Warnings Panel */}
        <AnimatePresence>
          {warningMessages.length > 0 && (
            <Panel position="bottom-right">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3,
                }}
                className="bg-warning/10 border border-warning rounded-lg p-4 max-w-md backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <MdWarning className="text-warning text-xl flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-warning font-semibold text-sm">
                      Validation Issues
                    </h3>
                    <ul className="text-warning text-xs space-y-1">
                      {warningMessages.map((message, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <span className="text-warning">•</span>
                          <span>{message}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </Panel>
          )}
        </AnimatePresence>

        {/* Undo/Redo Panel - Only show when undo or redo is available */}
        <AnimatePresence>
          {(canUndo || canRedo) && (
            <Panel position="bottom-left">
              <motion.div
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3,
                }}
                className="bg-background/80 border border-foreground/20 rounded-lg p-3 backdrop-blur-sm"
              >
                {/* Undo/Redo buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={undo}
                    disabled={!canUndo}
                    variant="subtle"
                    size="sm"
                    className="flex-1"
                  >
                    <MdUndo size={14} />
                    Undo
                  </Button>
                  <Button
                    onClick={redo}
                    disabled={!canRedo}
                    variant="subtle"
                    size="sm"
                    className="flex-1"
                  >
                    <MdRedo size={14} />
                    Redo
                  </Button>
                </div>
              </motion.div>
            </Panel>
          )}
        </AnimatePresence>
      </ReactFlow>
    </div>
  );
};

export default ToolBuilderEditor;
