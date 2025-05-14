import { ProductPayload } from "@/app/types/displays";

// TODO: figure out start rating being more flexible, for example from 0-1

interface ProductCardProps {
  product: ProductPayload;
  handleOpen: (product: ProductPayload) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, handleOpen }) => {

  return (
    <div
      key={`${product.name}`}
      className="flex flex-col gap-2 bg-gradient-to-br from-foreground_alt to-background_alt p-3 rounded-lg cursor-pointer hover:bg-foreground shadow-lg transition-all duration-300"
      onClick={() => handleOpen(product)}
    >
      <div className="flex flex-col gap-2 items-start justify-start">
        <img src={product.image} alt={product.name} className="rounded-lg" />
      </div>
      <div className="flex flex-col gap-3 items-start justify-start">
        <p className="text-sm text-primary font-bold truncate">{product.name}</p>
        <div className="flex flex-row justify-between w-full">
          <p className="text-sm text-primary">${product.price}</p>
          <div className="flex items-center  w-full justify-end">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < Math.round(product.rating)
                  ? "text-highlight"
                  : "text-secondary"
                  }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;