
import { useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Copy, CheckCircle, ExternalLink, Calendar } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useBackButton } from "@/hooks/useBackButton";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
  validUntil: Date;
  type: "medicine" | "doctor" | "both";
  minimumPurchase?: number;
  isCopied?: boolean;
}

const Coupons = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "c1",
      code: "WELCOME20",
      discount: "20% OFF",
      description: "20% off on your first medicine order",
      validUntil: new Date(2023, 6, 30),
      type: "medicine",
      minimumPurchase: 500,
      isCopied: false
    },
    {
      id: "c2",
      code: "DOCTOR100",
      discount: "₹100 OFF",
      description: "Flat ₹100 off on doctor consultation",
      validUntil: new Date(2023, 5, 15),
      type: "doctor",
      isCopied: false
    },
    {
      id: "c3",
      code: "ZEPMEDS25",
      discount: "25% OFF",
      description: "25% off on any service (max discount ₹200)",
      validUntil: new Date(2023, 7, 10),
      type: "both",
      isCopied: false
    },
    {
      id: "c4",
      code: "SUMMER15",
      discount: "15% OFF",
      description: "Summer special discount on medicines",
      validUntil: new Date(2023, 5, 30),
      type: "medicine",
      minimumPurchase: 300,
      isCopied: false
    }
  ]);
  
  useBackButton();

  const handleCopyCode = (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (coupon) {
      navigator.clipboard.writeText(coupon.code);
      
      // Update copied state
      setCoupons(coupons.map(c => 
        c.id === id ? { ...c, isCopied: true } : c
      ));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCoupons(coupons.map(c => 
          c.id === id ? { ...c, isCopied: false } : c
        ));
      }, 2000);
      
      toast({
        title: "Code copied!",
        description: `${coupon.code} has been copied to clipboard`,
      });
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    if (activeTab === "all") return true;
    return coupon.type === activeTab || coupon.type === "both";
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Coupons & Offers" />

      <main className="px-4 py-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="medicine">Medicine</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl overflow-hidden"
                >
                  <div className="relative bg-gradient-to-r from-zepmeds-purple/20 to-black/40 p-4 border border-white/10">
                    <div className="absolute -left-3 top-1/2 w-6 h-6 bg-background rounded-full transform -translate-y-1/2" />
                    <div className="absolute -right-3 top-1/2 w-6 h-6 bg-background rounded-full transform -translate-y-1/2" />
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <Ticket className="h-4 w-4 text-zepmeds-purple mr-1" />
                          <span className="text-zepmeds-purple font-semibold text-sm">
                            {coupon.type === "medicine" ? "MEDICINE" : coupon.type === "doctor" ? "DOCTOR" : "ALL SERVICES"}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{coupon.discount}</h3>
                        <p className="text-gray-300 text-sm mb-3">{coupon.description}</p>
                        
                        <div className="flex items-center text-xs text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Valid till: {coupon.validUntil.toLocaleDateString()}</span>
                        </div>
                        
                        {coupon.minimumPurchase && (
                          <div className="text-xs text-gray-400 mt-1">
                            Minimum purchase: ₹{coupon.minimumPurchase}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="bg-zepmeds-purple/10 border border-zepmeds-purple/20 rounded-md px-3 py-2 mb-2">
                          <code className="text-zepmeds-purple font-semibold">{coupon.code}</code>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-gray-300 hover:text-white"
                          onClick={() => handleCopyCode(coupon.id)}
                        >
                          {coupon.isCopied ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-300">No Coupons Available</h3>
                <p className="text-gray-400 text-sm">Check back later for new offers</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Special Offers</h2>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-morphism rounded-xl p-4 flex items-start"
            >
              <div className="w-12 h-12 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mr-4">
                <ExternalLink className="h-6 w-6 text-zepmeds-purple" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Refer & Earn</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Get ₹100 in your wallet for each friend who joins using your referral code.
                </p>
                <Button size="sm" className="bg-zepmeds-purple hover:bg-zepmeds-purple/80 text-xs">
                  Invite Friends
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-morphism rounded-xl p-4 flex items-start"
            >
              <div className="w-12 h-12 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-zepmeds-purple" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Monthly Subscription</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Subscribe to Zepmeds+ for additional discounts and free delivery on all orders.
                </p>
                <Button size="sm" className="bg-zepmeds-purple hover:bg-zepmeds-purple/80 text-xs">
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Coupons;
