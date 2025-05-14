"use client";

// TODO: buttons under

import React, { useState } from "react";
import { ProductPayload } from "@/app/types/displays";
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
  products: ProductPayload[];
}


const ProductDisplay: React.FC<ProductDisplayProps> = ({ products }) => {
  const [selectedItem, setSelectedItem] = useState<ProductPayload | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleOpen = (item: ProductPayload) => {
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
