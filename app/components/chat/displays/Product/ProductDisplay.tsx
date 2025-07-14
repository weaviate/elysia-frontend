"use client";

import React from "react";
import { ProductPayload } from "@/app/types/displays";
import ProductCard from "./ProductCard";
import DisplayPagination from "../../components/DisplayPagination";

interface ProductDisplayProps {
  products: ProductPayload[];
  handleResultPayloadChange: (
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any,
  ) => void;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({
  products,
  handleResultPayloadChange,
}) => {
  if (products.length === 0) return null;
  return (
    <DisplayPagination layout="horizontal" itemsPerPage={2}>
      {products.map((product, idx) => (
        <ProductCard
          key={idx + product.name}
          product={product}
          handleOpen={() => handleResultPayloadChange("product", product)}
        />
      ))}
    </DisplayPagination>
  );
};

export default ProductDisplay;
