import { Product } from "@/app/types/displays";

interface ProductCardProps {
  product: Product;
  handleOpen: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, handleOpen }) => {

  return (
    <div
      key={`${product.name}`}
      className="flex flex-col gap-2 border border-secondary bg-background_alt p-3 rounded-lg cursor-pointer hover:bg-foreground cursor-pointer transition-all duration-300"
      onClick={() => handleOpen(product)}
    >
      <div className="flex flex-col gap-2 items-start justify-start">
        <img src={product.image} alt={product.name} className="rounded-lg" />
      </div>
      <div className="flex flex-col gap-3 items-start justify-start">
        <p className="text-sm text-primary font-bold">{product.name}</p>
        <div className="flex flex-row justify-between w-full">
          <p className="text-xs text-primary">${product.price}</p>
          <div className="flex items-center  w-full justify-end">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${i < Math.round(product.rating)
                  ? "text-accent"
                  : "text-secondary"
                  }`}
              >
                ★
              </span>
            ))}
            <p className="text-xs text-accent font-light pl-1">({product.rating})</p>
          </div>
        </div>
        {/* <p className="text-xs text-secondary font-light">
            {product.collection} {" | "} {product.category} {" | "}
            {product.subcategory}
          </p> */}
      </div>
    </div>
  );
};

export default ProductCard;