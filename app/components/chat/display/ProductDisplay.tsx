"use client";

import React, { useEffect, useState } from "react";
import { ResultPayload } from "../../types";
import { Product } from "@/app/types/displays";
import ProductCard from "./ProductCard";
import ProductView from "./ProductView";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductDisplayProps {
  payload: ResultPayload;
}


const ProductDisplay: React.FC<ProductDisplayProps> = ({ payload }) => {
  const products = payload.objects as Product[];
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleOpen = (item: Product) => {
    setSelectedItem(item);
    setIsViewOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsViewOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };

  if (products.length === 0) return null;
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <Carousel className="w-full flex items-center justify-center gap-3">
        <CarouselPrevious variant="ghost" />
        <CarouselContent>
          {products.map((product, idx) => (
            <CarouselItem
              key={idx + product.name}
              className="basis-full md:basis-1/2 "
            >
              <ProductCard product={product} handleOpen={handleOpen} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext variant="ghost" />
      </Carousel>
      {selectedItem && (
        <ProductView
          product={selectedItem}
          onClose={handleClose}
          isOpen={isViewOpen}
        />
      )}
    </div>
  );
};

export default ProductDisplay;
