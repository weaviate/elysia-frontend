"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface DataKPIProps {
  loading: boolean;
  value: number;
  label: string;
  icon: React.ReactNode;
  color: "highlight" | "accent" | "muted";
  lines: boolean;
}

// Utility function to format numbers with dots for thousands
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("de-DE").format(num);
};

const DataKPI: React.FC<DataKPIProps> = ({
  loading,
  value,
  label,
  icon,
  color,
  lines,
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(0);

  const bgColorClass = {
    highlight: "bg-highlight/10",
    accent: "bg-accent/10",
    muted: "bg-foreground_alt/10",
  };
  const textColorClass = {
    highlight: "text-highlight",
    accent: "text-accent",
    muted: "text-foreground_alt",
  };

  // Spring animation for counting up numbers
  const springValue = useSpring(0, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
  });

  // Subscribe to spring value changes
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayNumber(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  // Animate to target value when not loading
  useEffect(() => {
    if (!loading && !hasAnimated) {
      springValue.set(value);
      setHasAnimated(true);
    }
  }, [loading, value, springValue, hasAnimated]);

  // Reset animation state when loading changes
  useEffect(() => {
    if (loading) {
      setHasAnimated(false);
      springValue.set(0);
    }
  }, [loading, springValue]);

  return (
    <motion.div
      className={`flex flex-row items-center justify-start flex-1 border-foreground ${lines ? "border border-dashed" : "border"} p-2 rounded-md gap-3`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <motion.div
        className={`flex items-center justify-center p-2 ${bgColorClass[color]} ${textColorClass[color]} rounded-md`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        whileHover={{
          scale: 1.1,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
      </motion.div>

      <div className="flex flex-col items-start justify-start">
        {loading ? (
          <>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-12" />
          </>
        ) : (
          <>
            <motion.p
              className={`${textColorClass[color]} text-2xl font-bold`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.3,
                type: "spring",
                stiffness: 150,
              }}
            >
              <motion.span>{formatNumber(displayNumber)}</motion.span>
            </motion.p>

            <motion.p
              className="text-secondary text-xs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.6,
                duration: 0.3,
              }}
            >
              {label}
            </motion.p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default DataKPI;
