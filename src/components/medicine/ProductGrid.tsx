
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number | null;
  rating: number;
  description?: string;
  category?: string;
  fullDescription?: string;
  manufacturer?: string;
  expiryDate?: string;
  dosage?: string;
  sideEffects?: string[];
  ingredients?: string[];
  inStock?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onProductClick?: (product: Product) => void;
  filteredCategory?: string;
}

const ProductGrid = ({ products, onAddToCart, onProductClick, filteredCategory }: ProductGridProps) => {
  // Filter products by category if specified
  const filteredProducts = filteredCategory && filteredCategory !== "All"
    ? products.filter(p => p.category === filteredCategory)
    : products;
    
  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-400">No medicines available in this category</p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {filteredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.1 }}
          className="h-full relative"
        >
          {product.inStock === false && (
            <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs py-1 px-2 rounded-full flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Out of Stock
            </div>
          )}
          <ProductCard
            name={product.name}
            image={product.image}
            price={product.price}
            discountPrice={product.discountPrice || undefined}
            rating={product.rating}
            description={product.description}
            onAddToCart={() => onAddToCart(product, 1)}
            onClick={() => onProductClick && onProductClick(product)}
            disabled={product.inStock === false}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
