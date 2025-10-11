import { Link } from "react-router-dom";
import { BsCartPlus, BsStar } from "react-icons/bs";
import { Button } from "../Button";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  variant?: 'default' | 'featured'; 
}

export function ProductCard({ product, onAddToCart, variant = 'default' }: ProductCardProps) {
  const isFeatured = variant === 'featured';
  
  const cardClasses = isFeatured
    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-300"
    : "bg-white";

  return (
    <div className={`${cardClasses} rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group`}>
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {isFeatured && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
            <BsStar size={10} />
            DESTAQUE
          </span>
        )}
 
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            -{product.discountPercentage.toFixed(0)}%
          </span>
        )}
      </div>

      <div className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] text-sm hover:text-blue-600 transition">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500 flex items-center gap-1 text-xs font-semibold">
            ⭐ {product.rating}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-xs text-gray-600">
            {product.stock} disponíveis
          </span>
        </div>
        
        <p className="text-xl font-bold text-green-600 mb-2">
          R$ {product.price.toFixed(2)}
        </p>
        
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-sm"
        >
          <BsCartPlus size={16} />
          Adicionar
        </Button>
      </div>
    </div>
  );
}