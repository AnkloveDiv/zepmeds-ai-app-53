import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { vitaminCImg, thermometerImg, painReliefImg, multivitaminImg } from "@/data/medicineData";

const products = [
  { id: "prod1", name: "Vitamin C Tablets", image: vitaminCImg, price: 350, discountPrice: 280, rating: 4.5, description: "Immunity Booster" },
  { id: "prod2", name: "Digital Thermometer", image: thermometerImg, price: 500, discountPrice: 399, rating: 4.2, description: "Accurate Reading" },
  { id: "prod3", name: "Pain Relief Gel", image: painReliefImg, price: 220, discountPrice: null, rating: 4.0, description: "Fast Relief" },
  { id: "prod4", name: "Multivitamin Capsules", image: multivitaminImg, price: 450, discountPrice: 410, rating: 4.7, description: "Daily Nutrition" }
];

type TrendingProductsProps = {
  setCartCount: (count: number) => void;
};

const TrendingProducts = ({ setCartCount }: TrendingProductsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProductClick = (product: any) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
        stripQuantity: 1
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCartCount(existingCart.length);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Trending Products</h2>
        <button 
          className="text-sm text-zepmeds-purple"
          onClick={() => navigate("/medicine-delivery")}
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.name}
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
              onAddToCart={() => handleProductClick(product)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;
