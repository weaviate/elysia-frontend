"use client";

import { ProductPayload } from "@/app/types/displays";

interface ProductViewProps {
  product: ProductPayload;
}

const ProductView: React.FC<ProductViewProps> = ({ product }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col max-w-[50%] gap-2 items-start justify-start">
        <img src={product.image} alt={product.name} className="rounded-lg" />
      </div>
      <div className="flex flex-col gap-5 items-start justify-start">
        <div className="flex flex-col overflow-scroll">
          <p className="text-sm text-secondary font-light">{product.brand}</p>
          <p className="text-2xl text-primary font-bold pb-2">{product.name}</p>
          <div className="flex items-center gap-1 w-full justify-start">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < Math.round(product.rating)
                    ? "text-alt_color_b"
                    : "text-primary"
                }`}
              >
                ★
              </span>
            ))}
            <p className="text-xs text-alt_color_b font-light">
              ({product.rating})
            </p>
          </div>
        </div>
        <p className="text-sm text-wrap max-h-[5rem] overflow-y-auto">
          {product.description}
        </p>
        <p className="text-sm text-secondary font-light">
          {product.collection} {" | "} {product.category} {" | "}
          {product.subcategory}
        </p>
        <div className="w-full flex justify-start">
          <p className="text-xl text-primary font-bold">${product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
