import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Node,
  Edge,
} from "@xyflow/react";
import { TreeContext } from "../contexts/TreeContext";
import { useContext, useEffect } from "react";
import { ToolItem, ToolMetadata } from "@/app/types/objects";
import { nodeTypes } from "./EditorNodes";

const ToolBuilderEditor = () => {
  const { selectedToolPreset, toolMetadata } = useContext(TreeContext);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const getBranchInfo = (branch_name: string) => {
    const branch = selectedToolPreset?.branches.find(
      (branch) => branch.name === branch_name
    );
    if (branch) {
      return {
        description: branch.description,
        instruction: branch.instruction,
      };
    }
    return null;
  };

  const getToolInfo = (tool_name: string): ToolMetadata | null => {
    const tool = toolMetadata[tool_name];
    if (tool) {
      return tool;
    }
    return null;
  };

  const handleDuplicateNode = (tool_item: ToolItem) => {
    console.log("duplicate node", tool_item);
  };

  const handleDeleteNode = (tool_item: ToolItem) => {
    console.log("delete node", tool_item);

    const nodeId = tool_item.name;

    // Remove the node from React Flow state
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));

    // Remove all edges connected to this node (both incoming and outgoing)
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );

    console.log("Deleted node and connected edges:", nodeId);
  };

  const parseToolPresetIntoTree = (
    toolItems: ToolItem[]
  ): { nodes: Node[]; edges: Edge[] } => {
    if (!toolItems || toolItems.length === 0) {
      return { nodes: [], edges: [] };
    }

    const parsedNodes: Node[] = [];
    const parsedEdges: Edge[] = [];

    // Track positions for simple layout
    const levelCounts: { [key: number]: number } = {};
    const nodeDepths: { [key: string]: number } = {};

    // First pass: determine depth of each node
    toolItems.forEach((item, index) => {
      let depth = 0;

      // If has tools to connect from, use those
      if (item.from_tools && item.from_tools.length > 0) {
        const parentDepths = item.from_tools
          .map((parentName) => nodeDepths[parentName] ?? 0)
          .filter((d) => d !== undefined);
        depth = parentDepths.length > 0 ? Math.max(...parentDepths) + 1 : 0;
      }
      // If no tools but has a branch, connect from that branch
      else if (item.from_branch && item.from_branch !== "") {
        depth = (nodeDepths[item.from_branch] ?? 0) + 1;
      }
      // Otherwise it's a root node

      nodeDepths[item.name] = depth;
    });

    // Second pass: create nodes and edges
    toolItems.forEach((item, index) => {
      const depth = nodeDepths[item.name];
      const levelCount = levelCounts[depth] || 0;
      levelCounts[depth] = levelCount + 1;

      // Create node
      const node: Node = {
        id: item.name,
        type: "toolEditorNode",
        position: {
          x: levelCount * 300, // Horizontal spacing
          y: depth * 300, // Vertical spacing
        },
        data: {
          label: item.name,
          branch_info: getBranchInfo(item.name) || null,
          tool_info: item,
          tool_metadata: getToolInfo(item.name) || null,
          delete_node: handleDeleteNode,
          duplicate_node: handleDuplicateNode,
        },
      };
      parsedNodes.push(node);

      // Create edges from parent tools or branch
      if (item.from_tools && item.from_tools.length > 0) {
        // Connect to specific tools
        item.from_tools.forEach((parentName) => {
          const edge: Edge = {
            id: `${parentName}-${item.name}`,
            source: parentName,
            target: item.name,
            animated: true,
          };
          parsedEdges.push(edge);
        });
      } else if (item.from_branch && item.from_branch !== "") {
        // Connect to branch (first tool of that branch)
        const edge: Edge = {
          id: `${item.from_branch}-${item.name}`,
          source: item.from_branch,
          target: item.name,
          animated: true,
        };
        parsedEdges.push(edge);
      }
    });

    return { nodes: parsedNodes, edges: parsedEdges };
  };

  // Update nodes and edges when selectedToolPreset changes
  useEffect(() => {
    console.log("selectedToolPreset", selectedToolPreset);
    if (selectedToolPreset) {
      console.log(selectedToolPreset);
      const { nodes: parsedNodes, edges: parsedEdges } =
        parseToolPresetIntoTree(selectedToolPreset.order);
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [selectedToolPreset]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        noWheelClassName="no-wheel"
        fitView
      >
        <Background gap={20} size={2} color="hsl(var(--foreground))" />
      </ReactFlow>
    </div>
  );
};

export default ToolBuilderEditor;
