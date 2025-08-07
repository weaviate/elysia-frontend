import { Handle, Position } from "@xyflow/react";
import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

interface DecisionNodeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNodeClick?: (nodeData: any) => void;
  selected?: boolean;
}

function DecisionNode({ data, onNodeClick, selected }: DecisionNodeProps) {
  const [opened, setOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  useEffect(() => {
    const updateTooltipPosition = () => {
      if (nodeRef.current && opened) {
        const rect = nodeRef.current.getBoundingClientRect();
        // Position tooltip above the node center with more clearance
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 50, // More space above the node
        });
      }
    };

    if (opened) {
      updateTooltipPosition();
      // Update position on scroll/zoom
      window.addEventListener("resize", updateTooltipPosition);
      window.addEventListener("scroll", updateTooltipPosition);

      return () => {
        window.removeEventListener("resize", updateTooltipPosition);
        window.removeEventListener("scroll", updateTooltipPosition);
      };
    }
  }, [opened]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsHovered(true);
    setOpened(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsHovered(false);
    setOpened(false);
  };

  const handleNodeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onNodeClick) {
      onNodeClick(data);
    }
  };

  const tooltipContent = (
    <div
      className="fixed bg-background/95 backdrop-blur-sm text-primary p-3 rounded-lg shadow-2xl border border-foreground/50 z-[10000] transform -translate-x-1/2"
      style={{
        top: tooltipPosition.y,
        left: tooltipPosition.x,
        pointerEvents: "none",
      }}
    >
      <p className="text-sm text-primary whitespace-nowrap">
        Click for more details
      </p>
      {/* Arrow pointing down */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-foreground/50" />
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
            scale: 1.05,
            y: -8,
            rotateZ: data.choosen ? 0 : 1,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleNodeClick}
          className={`
            w-[300px] h-[100px] cursor-pointer p-8 flex items-center justify-center rounded-lg
            transition-all duration-300 relative overflow-hidden
            ${
              data.choosen
                ? "bg-gradient-to-br from-accent/25 to-accent/10 text-accent border-2 border-accent shadow-lg shadow-accent/30 backdrop-blur-sm"
                : "bg-background_alt/70 text-secondary/60 border border-secondary/30 hover:border-secondary/50"
            }
            ${selected ? "ring-4 ring-highlight ring-opacity-80 shadow-2xl shadow-highlight/20" : ""}
            ${isHovered && !data.choosen ? "bg-background_alt/90 text-secondary/80 border-secondary/60 shadow-lg" : ""}
            ${isHovered && data.choosen ? "shadow-2xl shadow-accent/40" : ""}
          `}
          style={{
            boxShadow: data.choosen
              ? isHovered
                ? "0 0 30px rgba(var(--accent) / 0.4), inset 0 1px 0 rgba(255,255,255,0.15), 0 20px 40px rgba(var(--accent) / 0.1)"
                : "0 0 20px rgba(var(--accent) / 0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
              : isHovered
                ? "0 10px 30px rgba(0,0,0,0.1), 0 0 20px rgba(var(--secondary) / 0.1)"
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
            className={`font-bold text-lg truncate z-10 relative transition-all duration-300 ${
              data.choosen
                ? "text-accent"
                : isHovered
                  ? "text-secondary/90"
                  : "text-secondary/60"
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
                : isHovered
                  ? {
                      textShadow: "0 0 8px rgba(var(--secondary) / 0.3)",
                    }
                  : {}
            }
            transition={{
              duration: data.choosen ? 2 : 0.3,
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
