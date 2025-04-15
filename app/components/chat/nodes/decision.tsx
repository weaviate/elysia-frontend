import { Handle, Position } from "@xyflow/react";
import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Separator } from "@/components/ui/separator";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DecisionNode({ data }: { data: any }) {
  const [opened, setOpened] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  useEffect(() => {
    if (nodeRef.current && opened) {
      const rect = nodeRef.current.getBoundingClientRect();
      setTooltipPosition({ x: rect.right, y: rect.top });
    }
  }, [opened]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpened(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpened(false);
  };

  const tooltipContent = (
    <div
      className="absolute max-w-[300px] p-4 flex flex-col gap-2 rounded-lg bg-foreground z-[1000]"
      style={{
        top: tooltipPosition.y,
        left: tooltipPosition.x + 10,
      }}
    >
      {data.text && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-sm">{data.text}</h3>
        </div>
      )}
      <Separator />
      {data.description && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-sm">Description:</h3>
          <p className="text-xs">{data.description}</p>
        </div>
      )}
      {data.instruction && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-sm">Instructions:</h3>
          <p className="text-xs">{data.instruction}</p>
        </div>
      )}
      {data.reasoning && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-sm">Reasoning:</h3>
          <p className="text-xs">{data.reasoning}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div ref={nodeRef} draggable={false} className="flex gap-2">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={` ${
            data.choosen
              ? "bg-foreground text-primary border border-secondary "
              : "bg-background_alt text-secondary border-none"
          } hover:bg-foreground w-[300px] h-[100px] cursor-pointer truncate text-wrap p-8 flex items-center justify-center rounded-lg transition-all duration-300`}
        >
          <Handle type="target" position={Position.Top} />
          <p className="font-bold text-lg truncate">{data.text}</p>
          <Handle type="source" position={Position.Bottom} id="a" />
        </div>
      </div>
      {opened && ReactDOM.createPortal(tooltipContent, document.body)}
    </>
  );
}

export default DecisionNode;
