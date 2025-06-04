"use client";

import React from "react";
import { ProductPayload } from "@/app/types/displays";
import ProductCard from "./ProductCard";
import ResultDisplay from "./ResultDisplay";

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
  return (
    <ResultDisplay layout="horizontal" itemsPerPage={2}>
      {products.map((product, idx) => (
        <ProductCard
          key={idx + product.name}
          product={product}
          handleOpen={() => handleResultPayloadChange("product", product)}
        />
      ))}
    </ResultDisplay>
  );
};

export default ProductDisplay;
