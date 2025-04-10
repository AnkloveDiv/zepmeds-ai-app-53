
import { Star, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  rating: number;
  description?: string;
  onAddToCart?: () => void;
  onClick?: () => void;
}

const ProductCard = ({
  name,
  image,
  price,
  discountPrice,
  rating,
  description,
  onAddToCart,
  onClick
}: ProductCardProps) => {
  const discount = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-xl overflow-hidden bg-black/20 border border-white/10 transition-all duration-300 hover:border-zepmeds-purple/30 card-glow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-36 object-cover"
        />
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-white text-sm line-clamp-1">{name}</h3>
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
            <span className="text-xs text-white">{rating}</span>
          </div>
        </div>
        
        {description && (
          <p className="text-gray-400 text-xs mb-2 line-clamp-1">{description}</p>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div>
            {discountPrice ? (
              <div className="flex items-center">
                <span className="text-zepmeds-purple font-bold mr-2">₹{discountPrice}</span>
                <span className="text-gray-400 text-xs line-through">₹{price}</span>
              </div>
            ) : (
              <span className="text-zepmeds-purple font-bold">₹{price}</span>
            )}
          </div>
          
          <button 
            className="bg-zepmeds-purple text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-zepmeds-purple-light transition-colors"
            onClick={handleAddToCart}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
