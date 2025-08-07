"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionLineType,
  Position,
  ReactFlowInstance,
  Background,
} from "@xyflow/react";
import dagre from "dagre";

import "@xyflow/react/dist/style.css";

import DecisionNode from "./nodes/decision";
import NodeDetailsSidebar, { NodeData } from "./NodeDetailsSidebar";
import { DecisionTreeNode } from "@/app/types/objects";

interface FlowDisplayProps {
  currentTrees: DecisionTreeNode[];
}

const FlowDisplay: React.FC<FlowDisplayProps> = ({ currentTrees }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<NodeData | null>(
    null
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeClick = (nodeData: NodeData) => {
    setSelectedNodeData(nodeData);
    setSelectedNodeId(nodeData.originalId || null);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedNodeData(null);
    setSelectedNodeId(null);
  };

  const nodeTypes = useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decision: (props: any) => (
        <DecisionNode
          {...props}
          onNodeClick={handleNodeClick}
          selected={selectedNodeId === props.data.originalId}
        />
      ),
    }),
    [selectedNodeId]
  );

  useEffect(() => {
    console.log("currentTrees", currentTrees);
  }, [currentTrees]);

  // Dagre graph setup for layout
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 300;
  const nodeHeight = 100;

  const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = "TB"
  ) => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({
      rankdir: direction,
      ranksep: 120, // Increased vertical spacing for better visual hierarchy
      nodesep: 150, // Increased horizontal spacing for more breathing room
    });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };

      return newNode;
    });

    return { nodes: newNodes, edges };
  };

  // Find the leaf node that was chosen in a tree
  const findChosenLeafNode = (
    tree: DecisionTreeNode,
    nodeMap: Map<string, string>
  ): string | null => {
    const traverse = (
      node: DecisionTreeNode,
      currentNodeId?: string
    ): string | null => {
      const nodeId = currentNodeId || nodeMap.get(node.id);
      if (!nodeId) return null;

      // If this node is chosen and has no options, it's a leaf
      if (
        node.choosen &&
        (!node.options || Object.keys(node.options).length === 0)
      ) {
        return nodeId;
      }

      // If this node has options, check if any chosen child is a leaf
      if (node.options && Object.keys(node.options).length > 0) {
        for (const option of Object.keys(node.options)) {
          const childNode = node.options[option];
          if (childNode.choosen) {
            const result = traverse(childNode);
            if (result) return result;
          }
        }
      }

      return null;
    };

    return traverse(tree);
  };

  const createNodesEdges = (tree: DecisionTreeNode, index: number) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let idCounter = 0;
    const getId = () => `node-${idCounter++}-${index}`;
    const nodeMap = new Map<string, string>(); // Map original node id to react-flow node id

    const traverse = (
      node: DecisionTreeNode,
      parentId: string | null = null
    ) => {
      const nodeId = getId();
      nodeMap.set(node.id, nodeId);

      // Create decision node
      nodes.push({
        id: nodeId,
        type: "decision",
        data: {
          text: node.name,
          description: node.description,
          choosen: node.choosen,
          instruction: node.instruction,
          reasoning: node.reasoning,
          originalId: node.id, // Store original ID for reference
        },
        position: { x: 0, y: 0 },
      });

      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          animated: node.choosen,
          style: node.choosen
            ? {
                stroke: "hsl(var(--accent))",
                strokeWidth: 3,
                filter: "drop-shadow(0 0 6px hsl(var(--accent) / 0.6))",
              }
            : {
                stroke: "hsl(var(--secondary) / 0.3)",
                strokeWidth: 1,
              },
        });
      }

      if (node.options && Object.keys(node.options).length > 0) {
        Object.keys(node.options).forEach((option) => {
          traverse(node.options[option], nodeId);
        });
      }
    };

    traverse(tree);

    return {
      ...getLayoutedElements(nodes, edges),
      nodeMap,
      leafNodeId: findChosenLeafNode(tree, nodeMap),
      rootNodeId: nodes.length > 0 ? nodes[0].id : null,
    };
  };

  useEffect(() => {
    if (currentTrees.length > 0) {
      let allNodes: Node[] = [];
      let allEdges: Edge[] = [];

      // Store tree results to connect them
      const treeResults: Array<{
        nodes: Node[];
        edges: Edge[];
        leafNodeId: string | null;
        rootNodeId: string | null;
      }> = [];

      // Process each tree and collect results
      (currentTrees.length > 1
        ? currentTrees.slice(0, -1)
        : currentTrees
      ).forEach((tree, index) => {
        const result = createNodesEdges(tree, index);
        treeResults.push(result);
      });

      // Create a flowing, organic tree layout with branching structure
      const createFlowingLayout = () => {
        const centerX = 0;
        let currentY = 0;
        const branchSpacing = 800; // Horizontal spacing for tree branches
        const verticalFlow = 400; // Vertical flow between trees

        treeResults.forEach((result, index) => {
          // Create a flowing branch pattern - alternate sides and angles
          const isEvenTree = index % 2 === 0;
          const branchAngle = isEvenTree ? -0.3 : 0.3; // Slight angle for organic feel
          const horizontalOffset = isEvenTree
            ? -Math.abs(Math.sin(index * 0.5)) * branchSpacing
            : Math.abs(Math.sin(index * 0.5)) * branchSpacing;

          // Apply sophisticated positioning with curves and flow
          const offsetNodes = result.nodes.map((node, nodeIndex) => {
            const depthFactor = node.position.y / 100; // Use original tree depth
            const organicOffsetX =
              horizontalOffset + Math.cos(index + nodeIndex * 0.3) * 50;
            const organicOffsetY =
              currentY + Math.sin(index * 0.4 + nodeIndex * 0.2) * 30;

            return {
              ...node,
              position: {
                x:
                  centerX +
                  node.position.x +
                  organicOffsetX +
                  depthFactor * branchAngle * 100,
                y: organicOffsetY + node.position.y,
              },
            };
          });

          allNodes = [...allNodes, ...offsetNodes];
          allEdges = [...allEdges, ...result.edges];

          // Create enhanced inter-tree connections with organic curves
          if (
            index < treeResults.length - 1 &&
            result.leafNodeId &&
            treeResults[index + 1].rootNodeId
          ) {
            const nextTreeRootId = treeResults[index + 1].rootNodeId;

            // Create flowing connection with enhanced styling
            allEdges.push({
              id: `inter-tree-edge-${index}-${index + 1}`,
              source: result.leafNodeId!,
              target: nextTreeRootId!,
              type: "smoothstep",
              animated: true,
              style: {
                stroke: "hsl(var(--highlight))",
                strokeWidth: 5,
                strokeDasharray: "8,4",
                filter:
                  "drop-shadow(0 0 12px hsl(var(--highlight) / 0.6)) drop-shadow(0 0 24px hsl(var(--highlight) / 0.3))",
                background:
                  "linear-gradient(90deg, hsl(var(--highlight)), hsl(var(--accent)))",
              },
              label: `Query ${index + 2}`,
              labelStyle: {
                fill: "hsl(var(--highlight))",
                fontWeight: "bold",
                fontSize: "14px",
                textShadow: "0 0 8px hsl(var(--highlight) / 0.8)",
              },
              labelBgStyle: {
                fill: "hsl(var(--background))",
                fillOpacity: 0.9,
                stroke: "hsl(var(--highlight))",
                strokeWidth: 2,
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
              },
            });
          }

          // Progressive vertical flow with increasing spacing for dramatic effect
          const treeHeight =
            result.nodes.length > 0
              ? Math.max(...result.nodes.map((node) => node.position.y)) -
                Math.min(...result.nodes.map((node) => node.position.y)) +
                nodeHeight
              : nodeHeight;

          currentY += treeHeight + verticalFlow + index * 50; // Exponential spacing
        });
      };

      createFlowingLayout();

      setNodes(allNodes);
      setEdges(allEdges);

      // Reset fitView flag so it will be called again for new layout
      fitViewCalledRef.current = false;
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentTrees]);

  // Store the ReactFlow instance
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const fitViewCalledRef = useRef(false);

  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0 && !fitViewCalledRef.current) {
      // Delay to ensure nodes are rendered, then fit view with better parameters
      setTimeout(() => {
        reactFlowInstance.fitView({
          duration: 1500,
          minZoom: 0.1,
          maxZoom: 1,
          padding: 0.2, // 20% padding around the tree
        });
        fitViewCalledRef.current = true;
      }, 100);
    }
  }, [reactFlowInstance, nodes]);

  return (
    <div
      className={`flex justify-center w-full items-center overflow-hidden transition-all duration-300 relative`}
    >
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          connectionLineType={ConnectionLineType.SmoothStep}
          onEdgesChange={onEdgesChange}
          nodesDraggable={false}
          draggable={true}
          panOnDrag={true}
          zoomOnScroll={true}
          minZoom={0.1}
          maxZoom={2}
          onInit={setReactFlowInstance}
          className="transition-all duration-300"
        >
          <Background gap={20} size={2} color="hsl(var(--foreground))" />
        </ReactFlow>
      </div>

      {/* Node Details Sidebar */}
      <NodeDetailsSidebar
        isOpen={sidebarOpen}
        nodeData={selectedNodeData}
        onClose={handleSidebarClose}
      />
    </div>
  );
};

export default FlowDisplay;
