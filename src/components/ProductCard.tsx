
import { motion } from "framer-motion";
import { Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  discountPrice?: number | null;
  rating: number;
  description?: string;
  onClick?: () => void;
  onAddToCart?: () => void;
}

// Style added for cart animation
const cartAnimationStyle = `
  @keyframes cartPopup {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .cart-animation {
    animation: cartPopup 0.5s ease;
  }

  @keyframes floatUp {
    0% { opacity: 0; transform: translateY(0); }
    50% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-40px); }
  }

  .float-animation {
    position: absolute;
    top: 0;
    right: 10px;
    animation: floatUp 1s ease-out forwards;
    pointer-events: none;
  }
`;

const ProductCard = ({
  name,
  image,
  price,
  discountPrice = null,
  rating,
  description,
  onClick,
  onAddToCart,
}: ProductCardProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [floatingElements, setFloatingElements] = useState<number[]>([]);

  const getDiscountPercentage = () => {
    if (!discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Cart animation
    setIsAnimating(true);
    
    // Create floating element
    const id = Date.now();
    setFloatingElements(prev => [...prev, id]);
    
    // Remove floating element after animation completes
    setTimeout(() => {
      setFloatingElements(prev => prev.filter(item => item !== id));
    }, 1000);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    if (onAddToCart) {
      onAddToCart();
    }
    
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <>
      <style>{cartAnimationStyle}</style>
      <motion.div
        className="glass-morphism rounded-xl overflow-hidden relative"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        <div className="relative">
          <img src={image} alt={name} className="w-full h-32 object-cover" />
          
          {discountPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {getDiscountPercentage()}% OFF
            </div>
          )}
          
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
            {rating}
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="text-white font-medium truncate">{name}</h3>
          
          {description && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{description}</p>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <div>
              {discountPrice ? (
                <div className="flex flex-col">
                  <span className="text-green-400 font-semibold">₹{discountPrice}</span>
                  <span className="text-gray-400 text-xs line-through">₹{price}</span>
                </div>
              ) : (
                <span className="text-white font-semibold">₹{price}</span>
              )}
            </div>
            
            <div className="relative">
              <motion.button
                className={`p-2 rounded-full bg-zepmeds-purple ${isAnimating ? 'cart-animation' : ''}`}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 text-white" />
              </motion.button>
              
              {floatingElements.map(id => (
                <div key={id} className="float-animation">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductCard;
