
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";

const medicineImg = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const thermometerImg = "https://images.unsplash.com/photo-1588613254750-bc14209ae7ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const painReliefImg = "https://images.unsplash.com/photo-1558956546-130eb5b8ba93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const multivitaminImg = "https://images.unsplash.com/photo-1579165466741-7f35e4755183?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

const products = [
  { id: "prod1", name: "Vitamin C Tablets", image: medicineImg, price: 350, discountPrice: 280, rating: 4.5, description: "Immunity Booster" },
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
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Increase quantity if already in cart
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push({
        ...product,
        quantity: 1,
        stripQuantity: 1
      });
    }
    
    // Save updated cart
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
