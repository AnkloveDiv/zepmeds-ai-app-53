
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { TrendingProduct } from "@/types/productTypes";

interface ProductGridContentProps {
  products: TrendingProduct[];
  onProductClick: (product: TrendingProduct) => void;
  onAddToCart: (product: TrendingProduct) => void;
}

const ProductGridContent = ({ products, onProductClick, onAddToCart }: ProductGridContentProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
          >
            <ProductCard
              name={product.name}
              image={product.image}
              price={product.price}
              discountPrice={product.discountPrice}
              rating={product.rating}
              description={product.description}
              onClick={() => onProductClick(product)}
              onAddToCart={() => onAddToCart(product)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductGridContent;
