"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProductPayload } from "@/app/types/displays";
import ProductCard from "./ProductCard";
import DisplayPagination from "../../components/DisplayPagination";

interface ProductDisplayProps {
  products: ProductPayload[];
  handleResultPayloadChange: (
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any
  ) => void;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({
  products,
  handleResultPayloadChange,
}) => {
  if (products.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <DisplayPagination layout="horizontal" itemsPerPage={3}>
        {products.map((product, idx) => (
          <ProductCard
            key={`${product.id}-${product.name}-${idx}`}
            product={product}
            handleOpen={() => handleResultPayloadChange("product", product)}
            index={idx}
          />
        ))}
      </DisplayPagination>
    </motion.div>
  );
};

export default ProductDisplay;
