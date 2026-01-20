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

const ToolBuilderEditor = () => {
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
    >
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
        <Panel position="top-left">
          <div className="flex flex-row items-center gap-2 justify-start">
            <Input
              className={`text-primary bg-background/10 backdrop-blur-sm flex-1 min-w-0`}
              value={currentPresetName}
              onChange={(e) => updateCurrentPresetName(e.target.value)}
              placeholder="Preset name"
              autoFocus
            />
            <Button onClick={handleCreateNewPreset} variant="subtle">
              <IoMdAdd />
              Create
            </Button>
            <DeleteButton
              variant="subtle_cancel"
              classNameDefault="w-full"
              classNameConfirm="w-full sm:w-auto text-secondary hover:text-error border border-foreground "
              icon={<TiDelete />}
              text="Delete"
              confirmText="Are you sure?"
              onClick={() => {
                handleDeleteTreePreset(selectedToolPreset?.id || "");
              }}
            />
          </div>
        </Panel>
        <Panel position="top-right">
          <div className="flex flex-row gap-2 w-full justify-between">
            <div className="flex flex-row items-center gap-2">
              <Checkbox
                checked={currentDefaultState}
                onCheckedChange={(checked) => {
                  triggerDefaultState((checked as boolean) ?? false);
                }}
              />
              <p className="text-sm text-secondary">Set as default</p>
            </div>

            <Button
              onClick={async () => await saveTree()}
              variant="save"
              disabled={!unsavedChanges || savingTree}
            >
              <FaSave />
              {savingTree ? "Saving..." : "Save"}
            </Button>

            <Button
              onClick={() => selectToolPreset(selectedToolPreset?.id || "")}
              variant="cancel"
              disabled={!unsavedChanges || savingTree}
            >
              <GrRevert />
              Revert
            </Button>

            <Button onClick={handleAutoLayout} variant="clean">
              <LuLayoutDashboard />
              Auto Layout
            </Button>
          </div>
        </Panel>

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
