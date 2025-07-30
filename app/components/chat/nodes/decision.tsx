import { Handle, Position } from "@xyflow/react";
import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

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
      console.log("Setting tooltip position:", { x: rect.right, y: rect.top });
      setTooltipPosition({ x: rect.right, y: rect.top });
    }
  }, [opened]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log("Mouse enter - showing tooltip", data.text);
    setOpened(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log("Mouse leave - hiding tooltip");
    setOpened(false);
  };

  const tooltipContent = (
    <div
      className="fixed bg-background text-primary p-4 rounded-lg shadow-lg border border-foreground max-w-[400px] z-[10000]"
      style={{
        top: tooltipPosition.y + 10,
        left: tooltipPosition.x + 10,
        pointerEvents: "none",
      }}
    >
      {data.description && (
        <div className="mb-2">
          <strong className="text-accent">Description:</strong>
          <div className="text-sm mt-1">{data.description}</div>
        </div>
      )}
      {data.instruction && (
        <div className="mb-2">
          <strong className="text-highlight">Instructions:</strong>
          <div className="text-sm mt-1">{data.instruction}</div>
        </div>
      )}
      {data.reasoning && (
        <div className="mb-2">
          <strong className="text-alt_color_a">Reasoning:</strong>
          <div className="text-sm mt-1">{data.reasoning}</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div ref={nodeRef} draggable={false} className="flex gap-2">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: data.choosen ? [0, -2, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            y: {
              repeat: data.choosen ? Infinity : 0,
              duration: 2,
              ease: "easeInOut",
            },
          }}
          whileHover={{
            scale: data.choosen ? 1.05 : 1.02,
            y: data.choosen ? -5 : -2,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`
            w-[300px] h-[100px] cursor-pointer p-8 flex items-center justify-center rounded-lg
            transition-all duration-300 relative overflow-hidden
            ${
              data.choosen
                ? "bg-gradient-to-br from-accent/20 to-accent/5 text-accent border-2 border-accent shadow-lg shadow-accent/25 backdrop-blur-sm"
                : "bg-background_alt/60 text-secondary/50 border border-secondary/20 opacity-60 hover:opacity-80"
            }
            ${opened ? "ring-4 ring-yellow-400 ring-opacity-50" : ""}
          `}
          style={{
            boxShadow: data.choosen
              ? "0 0 20px rgba(var(--accent) / 0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "none",
          }}
        >
          {/* Pulse effect for selected nodes */}
          {data.choosen && (
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-accent/40"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <Handle
            type="target"
            position={Position.Top}
            className={
              data.choosen
                ? "!bg-accent !border-accent"
                : "!bg-secondary/40 !border-secondary/40"
            }
          />

          <motion.p
            className={`font-bold text-lg truncate z-10 relative ${
              data.choosen ? "text-accent" : "text-secondary/60"
            }`}
            animate={
              data.choosen
                ? {
                    textShadow: [
                      "0 0 5px rgba(var(--accent) / 0.5)",
                      "0 0 10px rgba(var(--accent) / 0.3)",
                      "0 0 5px rgba(var(--accent) / 0.5)",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: data.choosen ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {data.text}
          </motion.p>

          <Handle
            type="source"
            position={Position.Bottom}
            id="a"
            className={
              data.choosen
                ? "!bg-accent !border-accent"
                : "!bg-secondary/40 !border-secondary/40"
            }
          />
        </motion.div>
      </div>
      {opened && ReactDOM.createPortal(tooltipContent, document.body)}
    </>
  );
}

export default DecisionNode;
