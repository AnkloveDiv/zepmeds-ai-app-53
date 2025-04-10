
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, Copy, CheckCircle, Search, Clock, Tag } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useBackNavigation from "@/hooks/useBackNavigation";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
  expiryDate: string;
  minPurchase?: number;
  isNew?: boolean;
  category?: string;
}

const Coupons = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { ExitConfirmDialog } = useBackNavigation();
  
  // Define the coupons data
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "WELCOME20",
      discount: "20% OFF",
      description: "20% off on your first order",
      expiryDate: "30 Apr 2025",
      minPurchase: 500,
      isNew: true,
      category: "all"
    },
    {
      id: "2",
      code: "HEALTH25",
      discount: "25% OFF",
      description: "25% off on health supplements",
      expiryDate: "15 May 2025",
      minPurchase: 800,
      category: "health"
    },
    {
      id: "3",
      code: "MEDICINE15",
      discount: "15% OFF",
      description: "15% off on all medicines",
      expiryDate: "10 May 2025",
      minPurchase: 300,
      category: "medicine"
    },
    {
      id: "4",
      code: "FLAT100",
      discount: "₹100 OFF",
      description: "Flat ₹100 off on orders above ₹999",
      expiryDate: "25 Apr 2025",
      minPurchase: 999,
      category: "all"
    },
    {
      id: "5",
      code: "WELLNESS30",
      discount: "30% OFF",
      description: "30% off on wellness products",
      expiryDate: "05 May 2025",
      minPurchase: 1200,
      isNew: true,
      category: "wellness"
    }
  ]);

  // Handle copy to clipboard
  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopiedId(id);
        toast({
          title: "Copied to clipboard",
          description: `Coupon code ${code} copied`
        });
        
        // Reset copied status after 3 seconds
        setTimeout(() => {
          setCopiedId(null);
        }, 3000);
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive"
        });
      }
    );
  };

  // Filter coupons based on search term and category
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || coupon.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Define categories
  const categories = [
    { id: "all", name: "All" },
    { id: "medicine", name: "Medicine" },
    { id: "health", name: "Health" },
    { id: "wellness", name: "Wellness" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Coupons & Offers" />
      <ExitConfirmDialog />
      
      <main className="px-4 py-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search coupons..."
            className="pl-10 bg-black/20 border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex overflow-x-auto pb-2 mb-4 gap-2 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                activeCategory === category.id
                  ? "bg-zepmeds-purple text-white"
                  : "bg-black/20 text-gray-300 border border-white/10"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative glass-morphism rounded-xl overflow-hidden"
              >
                {coupon.isNew && (
                  <div className="absolute top-0 right-0 bg-zepmeds-purple text-white text-xs px-2 py-1 rounded-bl-lg">
                    NEW
                  </div>
                )}
                
                <div className="absolute left-0 top-0 h-full w-2 bg-zepmeds-purple"></div>
                
                <div className="p-4 pl-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Ticket className="h-5 w-5 text-zepmeds-purple" />
                    <div className="text-white font-medium">{coupon.discount}</div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{coupon.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Valid till {coupon.expiryDate}</span>
                    </div>
                    
                    {coupon.minPurchase && (
                      <div className="flex items-center text-xs text-gray-400">
                        <Tag className="h-3 w-3 mr-1" />
                        <span>Min. order: ₹{coupon.minPurchase}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="bg-black/30 px-3 py-2 rounded-lg border border-white/10 font-mono text-sm text-white">
                      {coupon.code}
                    </div>
                    
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zepmeds-purple/20 hover:bg-zepmeds-purple/30 text-zepmeds-purple"
                      onClick={() => handleCopy(coupon.code, coupon.id)}
                    >
                      {copiedId === coupon.id ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <Ticket className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-white text-lg mb-2">No coupons found</h3>
              <p className="text-gray-400 text-sm">
                {searchTerm ? "Try a different search term" : "Check back later for new coupons"}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Coupons;
