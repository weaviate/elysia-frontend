"use client";

import React, { useContext, useEffect, useState } from "react";

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionLineType,
  Background,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { ConversationContext } from "../contexts/ConversationContext";
import { Conversation } from "../types";
import { nodeTypes } from "../toolbuilder/EditorNodes";
import { TreeContext } from "../contexts/TreeContext";
import { TreeGraph } from "@/app/types/objects";

const FlowDisplay: React.FC = () => {
  const { currentConversation, conversations } =
    useContext(ConversationContext);
  const { parsePresetIntoTree } = useContext(TreeContext);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [conversationObject, setConversationObject] =
    useState<Conversation | null>(null);

  useEffect(() => {
    if (currentConversation) {
      const conversationObject =
        conversations.find(
          (conversation) => conversation.id === currentConversation
        ) || null;
      setConversationObject(conversationObject);
      if (conversationObject) {
        const newTreeGraph: TreeGraph = {
          id: conversationObject.id,
          name: conversationObject.name,
          nodes: conversationObject.nodes,
          edges: conversationObject.edges,
          default: false,
        };
        const { nodes: parsedNodes, edges: parsedEdges } = parsePresetIntoTree(
          newTreeGraph,
          true
        ) || { nodes: [], edges: [] };
        setNodes(parsedNodes);
        setEdges(parsedEdges);
      } else {
        setNodes([]);
        setEdges([]);
      }
    }
  }, [currentConversation, conversations, parsePresetIntoTree]);

  return (
    <div
      className={`flex justify-center w-full items-center overflow-hidden transition-all duration-300 relative`}
    >
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          snapToGrid
          snapGrid={[10, 10]}
          connectionLineType={ConnectionLineType.Step}
          noWheelClassName="no-wheel"
          defaultEdgeOptions={{
            style: { strokeWidth: 2 },
            animated: true,
          }}
          fitView
        >
          <Background gap={20} size={2} color="hsl(var(--foreground))" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowDisplay;
