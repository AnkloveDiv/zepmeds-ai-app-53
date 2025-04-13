
import { motion } from "framer-motion";
import { Star, ShoppingCart, Plus, Minus, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  discountPrice?: number | null;
  rating: number;
  description?: string;
  inStock?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onAddToCart?: (quantity: number) => void;
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

  .stepper-container {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    padding: 8px;
    border-radius: 0 0 10px 10px;
    transform-origin: bottom;
    z-index: 10;
  }
`;

const ProductCard = ({
  name,
  image,
  price,
  discountPrice = null,
  rating,
  description,
  inStock = true,
  disabled = false,
  onClick,
  onAddToCart,
}: ProductCardProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [floatingElements, setFloatingElements] = useState<number[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showStepper, setShowStepper] = useState(false);
  const [animateQuantity, setAnimateQuantity] = useState(false);

  const getDiscountPercentage = () => {
    if (!discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      setAnimateQuantity(true);
      setTimeout(() => setAnimateQuantity(false), 300);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Consider it loaded even if it's an error
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!inStock || disabled) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable. We'll notify you when it's back in stock.",
      });
      return;
    }
    
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
      onAddToCart(quantity);
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity > 1 ? 'units' : 'unit'} of ${name} has been added to your cart.`,
    });
    
    // Hide stepper after adding to cart
    setShowStepper(false);
  };

  const toggleStepper = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!inStock || disabled) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
      });
      return;
    }
    
    setShowStepper(prev => !prev);
  };

  // Auto-hide stepper if clicked outside
  useEffect(() => {
    if (!showStepper) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.stepper-container') && !target.closest('.cart-icon-button')) {
        setShowStepper(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showStepper]);

  return (
    <>
      <style>{cartAnimationStyle}</style>
      <motion.div
        className={`glass-morphism rounded-xl overflow-hidden relative h-full flex flex-col ${disabled ? 'opacity-80' : 'cursor-pointer'}`}
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={disabled ? undefined : onClick}
      >
        <div className="relative">
          <div className="w-full h-32 bg-gray-800/40 flex items-center justify-center overflow-hidden">
            {!imageLoaded && (
              <div className="animate-pulse w-12 h-12 rounded-full bg-gray-700"></div>
            )}
            {imageError ? (
              <div className="flex items-center justify-center h-full w-full text-gray-400 text-xs">
                Image not available
              </div>
            ) : (
              <img 
                src={image} 
                alt={name} 
                className={`w-full h-full object-contain p-2 ${!imageLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </div>
          
          {discountPrice && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
              {getDiscountPercentage()}% OFF
            </div>
          )}
          
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
            {rating}
          </div>
          
          {(!inStock || disabled) && (
            <div className="absolute top-2 right-2 bg-red-900/80 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <AlertTriangle className="w-3 h-3 text-red-300 mr-1" />
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-white font-medium truncate">{name}</h3>
          
          {description && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{description}</p>
          )}
          
          {(!inStock || disabled) && (
            <p className="text-red-400 text-xs mt-1">
              Not in stock right now, we will notify you
            </p>
          )}
          
          <div className="flex justify-between items-center mt-auto pt-2">
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
                className={`p-2 rounded-full ${(!inStock || disabled) ? 'bg-gray-700' : 'bg-zepmeds-purple'} ${isAnimating ? 'cart-animation' : ''} cart-icon-button`}
                onClick={toggleStepper}
              >
                {showStepper ? (
                  <Plus className="w-4 h-4 text-white" />
                ) : (
                  <ShoppingCart className="w-4 h-4 text-white" />
                )}
              </motion.button>
              
              {floatingElements.map(id => (
                <div key={id} className="float-animation">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              ))}
              
              {/* Quantity stepper */}
              {showStepper && (
                <motion.div 
                  className="stepper-container"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between px-2">
                    <motion.button 
                      className="w-8 h-8 flex items-center justify-center text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (quantity > 1) handleQuantityChange(quantity - 1);
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.span 
                      className="text-white text-sm font-medium mx-2"
                      animate={animateQuantity ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {quantity}
                    </motion.span>
                    
                    <motion.button 
                      className="w-8 h-8 flex items-center justify-center text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(quantity + 1);
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    className="w-full mt-2 py-1 bg-zepmeds-purple text-white text-xs rounded-md flex items-center justify-center"
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductCard;
