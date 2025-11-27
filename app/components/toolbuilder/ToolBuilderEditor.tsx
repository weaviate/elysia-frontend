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
        connectionLineType={ConnectionLineType.Step}
        noWheelClassName="no-wheel"
        fitView
      >
        <Background gap={20} size={2} color="hsl(var(--foreground))" />
        <Panel position="top-right">
          <Button
            onClick={handleAutoLayout}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            Auto Layout
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ToolBuilderEditor;
