"use client";

import React from "react";
import { ProductPayload } from "@/app/types/displays";
import ProductCard from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <Carousel className="w-full items-center justify-center gap-3">
        <CarouselContent className="w-full">
          {products.map((product, idx) => (
            <CarouselItem
              key={idx + product.name}
              className="basis-full md:basis-1/2 "
            >
              <ProductCard
                product={product}
                handleOpen={() => handleResultPayloadChange("product", product)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-2 mt-2">
          <CarouselPrevious variant="ghost" />
          <CarouselNext variant="ghost" />
        </div>
      </Carousel>
    </div>
  );
};

export default ProductDisplay;
