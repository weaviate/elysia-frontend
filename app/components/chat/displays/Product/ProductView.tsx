"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProductPayload } from "@/app/types/displays";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductViewProps {
  product: ProductPayload;
}

const ProductView: React.FC<ProductViewProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 + i * 0.05, duration: 0.2 }}
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
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="space-y-8">
        {/* Hero Image Section with Overlay Text */}
        <motion.div
          className="relative w-full h-[60vh] lg:h-[70vh] overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/3 to-secondary/8 shadow-2xl shadow-black/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {!imageLoaded && !imageError && (
            <Skeleton className="absolute inset-0 w-full h-full rounded-3xl" />
          )}

          {!imageError && (
            <motion.img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105 ${
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-secondary/30 text-center p-8">
                <div className="text-6xl mb-4 opacity-50">📷</div>
                <div className="text-sm opacity-60">Image unavailable</div>
              </div>
            </div>
          )}

          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Overlay Text */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-white space-y-4"
            >
              <p className="text-sm opacity-80 uppercase tracking-[0.25em] font-medium">
                {product.brand}
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extralight leading-[0.9] tracking-tight">
                {product.name}
              </h1>

              {/* Rating on image */}
              {product.rating && (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm opacity-70 font-light">
                    {product.rating.toFixed(1)}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="space-y-10 px-4 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="max-w-3xl mx-auto flex-col md:flex-row flex items-center justify-center gap-8"
          >
            {product.price && (
              <span className="text-5xl lg:text-6xl text-primary font-thin tracking-tighter">
                {formatPrice(product.price)}
              </span>
            )}
            <p className="text-xl text-secondary font-light leading-relaxed">
              {product.description}
            </p>
          </motion.div>

          {/* Details Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-12 border-y border-secondary/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="text-center space-y-3">
              <div className="text-xs text-secondary/40 uppercase tracking-[0.2em] font-medium">
                Collection
              </div>
              <div className="text-lg text-primary font-light">
                {product.collection}
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-xs text-secondary/40 uppercase tracking-[0.2em] font-medium">
                Category
              </div>
              <div className="text-lg text-primary font-light">
                {product.category}
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-xs text-secondary/40 uppercase tracking-[0.2em] font-medium">
                Type
              </div>
              <div className="text-lg text-primary font-light">
                {product.subcategory}
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          {product.tags &&
            Array.isArray(product.tags) &&
            product.tags.length > 0 && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <div className="flex flex-wrap justify-center gap-4">
                  {product.tags.map((tag, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 + i * 0.1, duration: 0.4 }}
                      className="px-6 py-3 bg-secondary/3 text-secondary/60 text-sm uppercase tracking-wide rounded-full border border-secondary/8 hover:bg-secondary/8 hover:border-secondary/15 transition-all duration-500 cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductView;
