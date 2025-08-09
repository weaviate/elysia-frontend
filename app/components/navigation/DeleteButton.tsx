"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  icon: React.ReactNode;
  text?: string;
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
  classNameConfirm?: string;
  disabled?: boolean;
  timerDuration?: number; // in milliseconds, defaults to 3000ms (3 seconds)
  classNameDefault?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  icon,
  text,
  confirmText,
  confirmIcon,
  onClick,
  variant = "destructive",
  size = "default",
  classNameDefault = "",
  classNameConfirm = "",
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

  // Enhanced animation variants with smoother easing
  const buttonVariants: Variants = {
    normal: {
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease-out
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    confirming: {
      scale: 1.03,
      transition: {
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.275], // Smooth spring with slight overshoot
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    tap: {
      scale: 0.97,
      transition: {
        duration: 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      scale: 1.01,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const iconVariants: Variants = {
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.7,
      x: -15,
      rotate: -10,
      transition: {
        duration: 0.3,
        ease: [0.55, 0.055, 0.675, 0.19], // Ease-in for exit
      },
    },
  };

  const textVariants: Variants = {
    initial: {
      opacity: 0,
      y: -15,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1, // Slight stagger for smoother appearance
      },
    },
    exit: {
      opacity: 0,
      y: 15,
      scale: 0.95,
      transition: {
        duration: 0.25,
        ease: [0.55, 0.055, 0.675, 0.19],
      },
    },
  };

  // Progress indicator variant for smooth countdown
  const progressVariants: Variants = {
    initial: { scaleX: 1, opacity: 0.7 },
    animate: {
      scaleX: 0,
      opacity: 0.9,
      transition: {
        duration: timerDuration / 1000,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      variants={buttonVariants}
      animate={isConfirming ? "confirming" : "normal"}
      whileTap="tap"
      whileHover="hover"
      className="relative"
    >
      <Button
        variant={variant}
        size={size}
        className={`relative overflow-hidden transition-all duration-300 ${isConfirming ? classNameConfirm : classNameDefault}`}
        onClick={handleClick}
        disabled={disabled}
      >
        {/* Progress indicator for countdown */}
        <AnimatePresence>
          {isConfirming && (
            <motion.div
              key="progress-bar"
              variants={progressVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full origin-left"
              style={{ transformOrigin: "left center" }}
            />
          )}
        </AnimatePresence>

        <motion.div
          className={`flex items-center justify-center ${text ? "gap-2" : ""}`}
          layout
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
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
            {((text && !isConfirming) ||
              (isConfirming && (confirmText || confirmIcon))) && (
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
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subtle pulse effect when confirming */}
        <AnimatePresence>
          {isConfirming && (
            <motion.div
              key="pulse-overlay"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.1, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute inset-0 bg-white rounded-[inherit] pointer-events-none"
            />
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};

export default DeleteButton;
