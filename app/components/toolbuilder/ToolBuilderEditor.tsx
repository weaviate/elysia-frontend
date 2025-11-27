import {
  ReactFlow,
  Background,
  Panel,
  ConnectionLineType,
} from "@xyflow/react";
import { TreeContext } from "../contexts/TreeContext";
import { useContext } from "react";
import { nodeTypes } from "./EditorNodes";
import { Button } from "@/components/ui/button";
import { Connection } from "@xyflow/react";
import "./proximity-edges.css";
import { FaSave } from "react-icons/fa";
import { GrRevert } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbLayoutGrid } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { IoMdAdd } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { DeleteButton } from "../navigation/DeleteButton";

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
    onNodesDelete,
    currentPresetName,
    updateCurrentPresetName,
  } = useContext(TreeContext);

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
            <Button onClick={handleAutoLayout} variant="subtle">
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
              onClick={() => {}}
            />
          </div>
        </Panel>
        <Panel position="top-right">
          <div className="flex flex-row gap-2 w-full justify-between">
            <Button onClick={handleAutoLayout} variant="save">
              <FaSave />
              Save
            </Button>
            <Button onClick={handleAutoLayout} variant="cancel">
              <GrRevert />
              Revert
            </Button>
            <Button onClick={handleAutoLayout} variant="clean">
              <LuLayoutDashboard />
              Auto Layout
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ToolBuilderEditor;
