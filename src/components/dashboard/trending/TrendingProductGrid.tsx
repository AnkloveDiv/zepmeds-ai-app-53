
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { TrendingProduct } from "@/hooks/useTrendingProducts";

interface TrendingProductGridProps {
  products: TrendingProduct[];
  onProductClick: (product: TrendingProduct) => void;
  onAddToCart: (product: TrendingProduct) => void;
}

const TrendingProductGrid = ({ 
  products, 
  onProductClick, 
  onAddToCart 
}: TrendingProductGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
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

export default TrendingProductGrid;
