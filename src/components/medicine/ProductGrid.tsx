
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

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
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onProductClick?: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart, onProductClick }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-400">No medicines available</p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.1 }}
          className="h-full"
        >
          <ProductCard
            name={product.name}
            image={product.image}
            price={product.price}
            discountPrice={product.discountPrice || undefined}
            rating={product.rating}
            description={product.description}
            onAddToCart={() => onAddToCart(product, 1)}
            onClick={() => onProductClick && onProductClick(product)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
