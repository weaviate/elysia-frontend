"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DisplayPaginationProps {
  children: React.ReactNode;
  className?: string;
  itemsPerPage?: number;
  layout?: "horizontal" | "vertical";
}

const DisplayPagination: React.FC<DisplayPaginationProps> = ({
  children,
  className = "",
  itemsPerPage = 3,
  layout = "vertical",
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [dynamicItemsPerPage, setDynamicItemsPerPage] = useState(itemsPerPage);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);

  // Convert children to array for easier manipulation
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;
  const totalPages = Math.ceil(totalItems / dynamicItemsPerPage);

  // Get current page items
  const startIndex = currentPage * dynamicItemsPerPage;
  const currentItems = childrenArray.slice(
    startIndex,
    startIndex + dynamicItemsPerPage
  );

  const goToPage = useCallback(
    (pageIndex: number) => {
      if (pageIndex >= 0 && pageIndex < totalPages) {
        setCurrentPage(pageIndex);
      }
    },
    [totalPages]
  );

  const goToPrevious = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    setDynamicItemsPerPage(newItemsPerPage);
    setCurrentPage(0); // Reset to first page when items per page changes
  };

  // Auto-scroll active bubble into view
  useEffect(() => {
    if (bubbleContainerRef.current && totalPages > 1) {
      const container = bubbleContainerRef.current;
      const activeBubble = container.children[currentPage] as HTMLElement;

      if (activeBubble) {
        activeBubble.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentPage, totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  // Only render if there are children - moved after all hooks
  if (totalItems === 0) return null;

  // Determine layout classes based on layout prop and items per page
  const isHorizontal = layout === "horizontal";

  // Generate dynamic grid classes based on items per page for horizontal layout
  const getGridClasses = () => {
    if (!isHorizontal) {
      return {
        containerClass: "flex flex-col",
        itemContainerClass: "w-full",
        gapClass: "gap-2",
      };
    }

    // For horizontal layout, create dynamic responsive grid
    // Max 3 columns horizontally, max 9 items total (3x3 grid)
    let gridCols = "";
    let containerClass = "";
    let itemContainerClass = "w-full h-full";

    switch (dynamicItemsPerPage) {
      case 1:
        // Single item: center it and limit max width
        containerClass = "flex justify-center";
        itemContainerClass = "w-full max-w-sm h-full"; // max-w-sm = 384px
        break;
      case 2:
        gridCols = "grid-cols-1 md:grid-cols-2";
        containerClass = `grid ${gridCols}`;
        break;
      case 3:
        gridCols = "grid-cols-1 md:grid-cols-3";
        containerClass = `grid ${gridCols}`;
        break;
      case 6:
        gridCols = "grid-cols-1 md:grid-cols-3";
        containerClass = `grid ${gridCols}`;
        break;
      case 9:
        gridCols = "grid-cols-1 md:grid-cols-3";
        containerClass = `grid ${gridCols}`;
        break;
      default:
        gridCols = "grid-cols-1 lg:grid-cols-3";
        containerClass = `grid ${gridCols}`;
    }

    return {
      containerClass,
      itemContainerClass,
      gapClass: "gap-4",
    };
  };

  const { containerClass, itemContainerClass, gapClass } = getGridClasses();

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  return (
    <div className="w-full flex flex-col justify-start items-start gap-4">
      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Main carousel container */}
      <div className="w-full">
        <div
          className={`flex flex-col w-full justify-start items-start gap-2 rounded-lg ${className}`}
        >
          {/* Carousel content with dynamic layout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${containerClass} w-full h-full ${gapClass}`}
            >
              {currentItems.map((child, index) => (
                <motion.div
                  key={`${currentPage}-${index}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  className={itemContainerClass}
                >
                  {child}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Items per page selector */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary">Items per page:</span>
          <Select
            value={dynamicItemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="9">9</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show pagination info */}
        <div className="text-sm text-secondary">
          {totalItems > 0 && (
            <span>
              {startIndex + 1}-
              {Math.min(startIndex + dynamicItemsPerPage, totalItems)} of{" "}
              {totalItems}
            </span>
          )}
        </div>
      </div>

      {/* Navigation controls */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center items-center w-full gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {/* Previous arrow */}
          <motion.button
            onClick={goToPrevious}
            disabled={currentPage === 0}
            whileHover={currentPage === 0 ? {} : { scale: 1.1 }}
            whileTap={currentPage === 0 ? {} : { scale: 0.95 }}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              currentPage === 0
                ? "opacity-30 cursor-not-allowed text-secondary"
                : "hover:bg-foreground_alt text-primary"
            }`}
          >
            <FaChevronLeft className="w-3 h-3" />
          </motion.button>

          {/* Page indicators (dots) */}
          <div
            ref={bubbleContainerRef}
            className="flex items-center gap-2 max-w-72 overflow-x-auto px-2 scrollbar-none"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <motion.button
                key={index}
                onClick={() => goToPage(index)}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                className={`h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                  index === currentPage
                    ? "w-8 bg-primary shadow-md"
                    : "w-2 bg-secondary hover:bg-primary/70"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          {/* Next arrow */}
          <motion.button
            onClick={goToNext}
            disabled={currentPage === totalPages - 1}
            whileHover={currentPage === totalPages - 1 ? {} : { scale: 1.1 }}
            whileTap={currentPage === totalPages - 1 ? {} : { scale: 0.95 }}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              currentPage === totalPages - 1
                ? "opacity-30 cursor-not-allowed text-secondary"
                : "hover:bg-foreground_alt text-primary"
            }`}
          >
            <FaChevronRight className="w-3 h-3" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default DisplayPagination;
