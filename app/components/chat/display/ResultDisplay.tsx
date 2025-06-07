"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ResultDisplayProps {
  children: React.ReactNode;
  className?: string;
  itemsPerPage?: number;
  layout?: "horizontal" | "vertical";
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  children,
  className = "",
  itemsPerPage = 3,
  layout = "vertical",
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);

  // Convert children to array for easier manipulation
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Only render if there are children
  if (totalItems === 0) return null;

  // Get current page items
  const startIndex = currentPage * itemsPerPage;
  const currentItems = childrenArray.slice(
    startIndex,
    startIndex + itemsPerPage
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

  // Determine layout classes based on layout prop
  const isHorizontal = layout === "horizontal";
  const containerFlexClass = isHorizontal ? "flex-row" : "flex-col";
  const itemContainerClass = isHorizontal ? "flex-1 w-full" : "w-full";
  const gapClass = isHorizontal ? "gap-4" : "gap-2";

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
          className={`flex flex-col w-full fade-in justify-start items-start gap-2 rounded-lg ${className}`}
        >
          {/* Carousel content with dynamic layout */}
          <div
            className={`flex ${containerFlexClass} w-full h-full ${gapClass}`}
          >
            {currentItems.map((child, index) => (
              <div
                key={`${currentPage}-${index}`}
                className={itemContainerClass}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center w-full gap-3">
          {/* Previous arrow */}
          <button
            onClick={goToPrevious}
            disabled={currentPage === 0}
            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
              currentPage === 0
                ? "opacity-30 cursor-not-allowed text-secondary"
                : "hover:bg-foreground_alt text-primary hover:text-accent"
            }`}
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>

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
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`h-2 rounded-full transition-all duration-300 hover:scale-125 flex-shrink-0 ${
                  index === currentPage
                    ? "w-8 bg-accent shadow-md"
                    : "w-2 bg-secondary hover:bg-primary/70"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages - 1}
            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
              currentPage === totalPages - 1
                ? "opacity-30 cursor-not-allowed text-secondary"
                : "hover:bg-foreground_alt text-primary hover:text-accent"
            }`}
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
