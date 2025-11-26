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
import { useAutoLayout } from "@/hooks/useAutoLayout";
import { Connection } from "@xyflow/react";

const ToolBuilderEditor = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
  } = useContext(TreeContext);

  const { getLayoutedElements } = useAutoLayout({
    direction: "TB",
    nodeWidth: 280,
    nodeHeight: 120,
    rankSeparation: 200,
    nodeSeparation: 150,
  });

  const handleAutoLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );

    // Update nodes with new positions
    onNodesChange(
      layoutedNodes.map((node) => ({
        type: "position",
        id: node.id,
        position: node.position,
      }))
    );
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
