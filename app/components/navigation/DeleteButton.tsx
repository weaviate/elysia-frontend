"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  icon: React.ReactNode;
  text: string;
  confirmText?: string;
  confirmIcon?: React.ReactNode;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  timerDuration?: number; // in milliseconds, defaults to 3000ms (3 seconds)
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  icon,
  text,
  confirmText,
  confirmIcon,
  onClick,
  variant = "destructive",
  size = "default",
  className = "",
  disabled = false,
  timerDuration = 3000,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isConfirming && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 100);
      }, 100);
    } else if (isConfirming && timeLeft <= 0) {
      setIsConfirming(false);
      setTimeLeft(0);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isConfirming, timeLeft]);

  const handleClick = () => {
    if (disabled) return;

    if (!isConfirming) {
      // First click - enter confirmation state
      setIsConfirming(true);
      setTimeLeft(timerDuration);
    } else {
      // Second click - execute the action
      setIsConfirming(false);
      setTimeLeft(0);
      onClick();
    }
  };

  // Animation variants
  const buttonVariants: Variants = {
    normal: {
      scale: 1,
      transition: { duration: 0.2 },
    },
    confirming: {
      scale: 1.02,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  const iconVariants: Variants = {
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: -10,
      transition: { duration: 0.2, ease: [0.4, 0, 0.6, 1] },
    },
  };

  const textVariants: Variants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2, ease: [0.4, 0, 0.6, 1] },
    },
  };

  return (
    <motion.div
      variants={buttonVariants}
      animate={isConfirming ? "confirming" : "normal"}
      whileTap="tap"
    >
      <Button
        variant={variant}
        size={size}
        className={`transition-colors duration-200 ${className}`}
        onClick={handleClick}
        disabled={disabled}
      >
        <motion.div
          className="flex items-center gap-2"
          layout
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {!isConfirming && (
              <motion.span
                key="icon"
                variants={iconVariants}
                initial="visible"
                animate="visible"
                exit="hidden"
                className="flex-shrink-0"
              >
                {icon}
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.span
              key={isConfirming ? "confirm-text" : "normal-text"}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="whitespace-nowrap"
            >
              {isConfirming ? confirmText || confirmIcon : text}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default DeleteButton;
