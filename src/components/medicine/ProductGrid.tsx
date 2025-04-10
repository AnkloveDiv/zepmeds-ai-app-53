
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPrice: number | null;
  rating: number;
  description: string;
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
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart, onProductClick }: ProductGridProps) => {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.2 }}
        >
          <ProductCard
            name={product.name}
            image={product.image}
            price={product.price}
            discountPrice={product.discountPrice}
            rating={product.rating}
            description={product.description}
            onAddToCart={() => onAddToCart(product)}
            onClick={() => onProductClick(product)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
