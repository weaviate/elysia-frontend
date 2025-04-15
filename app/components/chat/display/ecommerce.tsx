"use client";

import React, { useEffect, useState } from "react";
import { Ecommerce, ResultPayload } from "../../types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EcommerceDisplayProps {
  payload: ResultPayload;
}

interface EcommerceCardProps {
  product: Ecommerce;
}

const EcommerceCard: React.FC<EcommerceCardProps> = ({ product }) => {
  return (
    <div
      key={`${product.name}`}
      className="flex flex-col gap-2 border border-secondary bg-background_alt p-3 rounded-lg"
    >
      <div className="flex flex-col gap-2 items-start justify-start">
        <img src={product.image} alt={product.name} className="rounded-lg" />
      </div>
      <div className="flex flex-col gap-3 items-start justify-start">
        <div className="flex flex-col overflow-scroll">
          <p className="text-xs text-secondary font-light">{product.brand}</p>
          <p className="text-sm text-primary font-bold">{product.name}</p>
          <div className="flex items-center gap-1 w-full justify-start">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < Math.round(product.rating)
                    ? "text-accent"
                    : "text-secondary"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-wrap h-[5rem] overflow-y-auto">
          {product.description}
        </p>
        <p className="text-xs text-secondary font-light">
          {product.collection} {" | "} {product.category} {" | "}
          {product.subcategory}
        </p>
        <div className="w-full flex justify-end">
          <p className="text-lg text-primary font-bold">${product.price}</p>
        </div>
      </div>
    </div>
  );
};

const EcommerceDisplay: React.FC<EcommerceDisplayProps> = ({ payload }) => {
  const products = payload.objects as Ecommerce[];

  const [productPairs, setProductPairs] = useState<Ecommerce[][]>([]);

  useEffect(() => {
    const pairs: Ecommerce[][] = [];
    for (let i = 0; i < products.length; i += 2) {
      if (i + 1 < products.length) {
        pairs.push([products[i], products[i + 1]]);
      } else {
        pairs.push([products[i]]);
      }
    }
    setProductPairs(pairs);
  }, [products]);

  if (products.length === 0) return null;
  return (
    <Carousel className="w-full flex items-center justify-center gap-3">
      <CarouselPrevious variant="ghost" />
      <CarouselContent>
        {productPairs.map((product_pair, idx) => (
          <>
            <CarouselItem
              key={idx + product_pair[0].name}
              className={`basis-full lg:basis-1/2`}
            >
              <EcommerceCard product={product_pair[0]} />
            </CarouselItem>
            {product_pair.length > 1 && (
              <CarouselItem
                key={idx + product_pair[1].name}
                className="basis-full lg:basis-1/2"
              >
                <EcommerceCard product={product_pair[1]} />
              </CarouselItem>
            )}
          </>
        ))}
      </CarouselContent>
      <CarouselNext variant="ghost" />
    </Carousel>
  );
};

export default EcommerceDisplay;
