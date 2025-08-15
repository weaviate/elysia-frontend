"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ProductPayload } from "@/app/types/displays";
import { Skeleton } from "@/components/ui/skeleton";

// TODO: figure out start rating being more flexible, for example from 0-1

interface ProductCardProps {
  product: ProductPayload;
  handleOpen: (product: ProductPayload) => void;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  handleOpen,
  index = 0,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1], // easeOut cubic-bezier
      },
    },
  };

  const hoverVariants = {
    scale: 1.02,
    y: -4,
  };

  const tapVariants = {
    scale: 0.98,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 + i * 0.1 }}
        className={`text-sm transition-colors duration-200 ${
          i < Math.round(rating) ? "text-alt_color_b" : "text-secondary/30"
        }`}
      >
        ★
      </motion.span>
    ));
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverVariants}
      whileTap={tapVariants}
      className="group relative w-full h-full"
    >
      <div
        className="flex flex-row sm:flex-col bg-background_alt border border-secondary/10 rounded-xl cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden"
        onClick={() => handleOpen(product)}
      >
        {/* Image Container - responsive sizing and layout */}
        <div className="relative w-16 h-16 sm:w-full sm:h-auto sm:aspect-square overflow-hidden bg-secondary/5 rounded-lg flex-shrink-0 m-2 sm:m-0">
          {!imageLoaded && !imageError && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}

          {!imageError && (
            <motion.img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              loading="lazy"
            />
          )}

          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/10">
              <div className="text-secondary/50 text-center p-4">
                <div className="text-2xl mb-2">📷</div>
                <div className="text-xs">Image unavailable</div>
              </div>
            </div>
          )}

          {/* Overlay for hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-1 py-2 pr-2 sm:p-3 lg:p-4 gap-1 sm:gap-2 lg:gap-3 min-w-0">
          {/* Product Name */}
          <motion.h3
            className="text-xs sm:text-sm font-semibold text-primary line-clamp-1 sm:line-clamp-2 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {product.name}
          </motion.h3>

          {/* Brand - Hidden on mobile */}
          {product.brand && (
            <motion.p
              className="hidden sm:block text-xs text-secondary/70 uppercase tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {product.brand}
            </motion.p>
          )}

          {/* Price and Rating Container */}
          <div className="flex items-center justify-between mt-auto">
            {/* Price */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {product.price && (
                <span className="text-sm sm:text-base lg:text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              )}
            </motion.div>

            {/* Rating - Simplified on mobile */}
            {product.rating && (
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex">
                  {/* Show only 1 star + rating number on mobile, full stars on larger screens */}
                  <span className="text-xs sm:hidden text-alt_color_b">★</span>
                  <span className="hidden sm:flex">
                    {renderStars(product.rating)}
                  </span>
                </div>
                <span className="text-xs text-secondary/70 ml-1">
                  {product.rating.toFixed(1)}
                </span>
              </motion.div>
            )}
          </div>

          {/* Tags - Hidden on mobile and small screens */}
          {product.tags &&
            Array.isArray(product.tags) &&
            product.tags.length > 0 && (
              <motion.div
                className="hidden lg:flex flex-wrap gap-1 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {product.tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
