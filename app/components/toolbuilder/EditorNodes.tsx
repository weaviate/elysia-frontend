import { Handle, Position } from "@xyflow/react";
import { FaTools } from "react-icons/fa";
import { TbGitBranch } from "react-icons/tb";

interface NodeData {
  label: string;
}

// Tool Node Component
export const ToolNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="flex flex-col items-center gap-2 bg-background border-2 border-foreground rounded-lg p-3 min-w-[160px] shadow-md">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-foreground !w-3 !h-3 !border-2 !border-background"
      />

      <div className="flex items-center justify-center p-2 rounded-md bg-primary/10 text-primary">
        <FaTools className="text-lg" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-secondary uppercase font-semibold tracking-wide">
          Tool
        </span>
        <span className="text-sm font-medium text-foreground text-center">
          {data.label}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-foreground !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  );
};

// Branch Node Component
export const BranchNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="flex flex-col items-center gap-2 bg-background border-2 border-highlight rounded-lg p-3 min-w-[160px] shadow-md">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-highlight !w-3 !h-3 !border-2 !border-background"
      />

      <div className="flex items-center justify-center p-2 rounded-md bg-highlight/10 text-highlight">
        <TbGitBranch className="text-lg" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-secondary uppercase font-semibold tracking-wide">
          Branch
        </span>
        <span className="text-sm font-medium text-foreground text-center">
          {data.label}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-highlight !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  );
};

export const nodeTypes = {
  toolNode: ToolNode,
  branchNode: BranchNode,
};
