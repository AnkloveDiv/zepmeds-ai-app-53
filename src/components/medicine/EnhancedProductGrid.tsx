
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductGrid from "./ProductGrid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, AlertTriangle } from "lucide-react";

interface EnhancedProductGridProps {
  products: any[];
  searchQuery?: string;
  onAddToCart: (product: any, quantity: number) => void;
}

const EnhancedProductGrid = ({ 
  products, 
  searchQuery = "", 
  onAddToCart 
}: EnhancedProductGridProps) => {
  const { toast } = useToast();
  const [notifyMeEmails, setNotifyMeEmails] = useState<{[key: string]: boolean}>({});
  
  // Filter products based on search query
  const filteredProducts = searchQuery 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;
    
  const handleNotifyMe = (productName: string) => {
    setNotifyMeEmails(prev => ({...prev, [productName]: true}));
    
    toast({
      title: "We'll notify you!",
      description: `We'll let you know when ${productName} is back in stock.`,
    });
  };
  
  // If there's a search query but no matching products
  const hasNoResults = searchQuery && filteredProducts.length === 0;

  return (
    <div>
      {hasNoResults ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-5 mb-6 text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <h3 className="text-white text-lg font-medium mb-1">"{searchQuery}" is not in stock</h3>
          <p className="text-gray-400 mb-4">We'll add it to our inventory soon!</p>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {notifyMeEmails[searchQuery] ? (
              <Button 
                variant="outline" 
                className="bg-green-500/20 text-green-400 border-green-500/50"
                disabled
              >
                We'll notify you!
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="border-zepmeds-purple text-zepmeds-purple"
                onClick={() => handleNotifyMe(searchQuery)}
              >
                Notify me when available
              </Button>
            )}
          </motion.div>
          
          <div className="mt-6 border-t border-white/10 pt-4">
            <h4 className="text-white font-medium mb-2">You might be interested in:</h4>
            <ProductGrid 
              products={products.slice(0, 4)} 
              onAddToCart={onAddToCart}
            />
          </div>
        </motion.div>
      ) : (
        <ProductGrid 
          products={filteredProducts} 
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

export default EnhancedProductGrid;
