import { useCallback } from "react";
import { Node, Edge } from "@xyflow/react";
import dagre from "dagre";

export interface LayoutOptions {
  direction: "TB" | "BT" | "LR" | "RL";
  nodeWidth: number;
  nodeHeight: number;
  rankSeparation: number;
  nodeSeparation: number;
}

const defaultOptions: LayoutOptions = {
  direction: "TB", // Top to Bottom
  nodeWidth: 280, // Match your node width
  nodeHeight: 120, // Approximate node height
  rankSeparation: 150, // Vertical spacing between levels
  nodeSeparation: 100, // Horizontal spacing between nodes
};

export const useAutoLayout = (options: Partial<LayoutOptions> = {}) => {
  const layoutOptions = { ...defaultOptions, ...options };

  const getLayoutedElements = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      // Create a new directed graph
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));

      // Set graph attributes
      dagreGraph.setGraph({
        rankdir: layoutOptions.direction,
        ranksep: layoutOptions.rankSeparation,
        nodesep: layoutOptions.nodeSeparation,
      });

      // Add nodes to the graph
      nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
          width: layoutOptions.nodeWidth,
          height: layoutOptions.nodeHeight,
        });
      });

      // Add edges to the graph
      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      // Run the layout algorithm
      dagre.layout(dagreGraph);

      // Apply the calculated positions to nodes
      const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          ...node,
          position: {
            // Dagre gives us the center position, but React Flow expects top-left
            x: nodeWithPosition.x - layoutOptions.nodeWidth / 2,
            y: nodeWithPosition.y - layoutOptions.nodeHeight / 2,
          },
        };
      });

      return { nodes: layoutedNodes, edges };
    },
    [layoutOptions]
  );

  return { getLayoutedElements };
};
