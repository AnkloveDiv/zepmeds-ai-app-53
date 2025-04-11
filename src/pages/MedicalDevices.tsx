
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import SearchBar from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Heart, Stethoscope, Activity, Microscope, LifeBuoy, Clock, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TrackOrderButton from "@/components/order/TrackOrderButton";

const MedicalDevices = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  const devices = [
    { id: "md1", name: "Digital Thermometer", category: "Thermometers", price: 499, discountPrice: 399, rating: 4.8, image: "https://images.unsplash.com/photo-1588613254750-bc14209ae7ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { id: "md2", name: "Blood Pressure Monitor", category: "Monitors", price: 2499, discountPrice: 1999, rating: 4.7, image: "https://images.unsplash.com/photo-1577368211130-4bbd0181ddf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { id: "md3", name: "Pulse Oximeter", category: "Monitors", price: 1499, discountPrice: 1299, rating: 4.6, image: "https://images.unsplash.com/photo-1583947214858-88bc0480a271?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { id: "md4", name: "Glucose Monitor Kit", category: "Monitors", price: 1299, discountPrice: null, rating: 4.5, image: "https://images.unsplash.com/photo-1554498808-d3ae8f23540c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { id: "md5", name: "Nebulizer Machine", category: "Therapy", price: 1799, discountPrice: 1599, rating: 4.4, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { id: "md6", name: "Digital Weighing Scale", category: "Monitors", price: 999, discountPrice: 799, rating: 4.3, image: "https://images.unsplash.com/photo-1564903856119-3171293a2e07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
  ];
  
  const handleAddToCart = (product: any) => {
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
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    });
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Medical Devices" />
      
      <main className="px-4 py-4">
        <SearchBar placeholder="Search for medical devices..." />
        
        <div className="mt-6 glass-morphism rounded-xl p-4 bg-gradient-to-br from-blue-600/20 to-cyan-400/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-medium mb-1">Medical Devices</h3>
              <p className="text-gray-300">25% off on select devices</p>
            </div>
            <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Thermometer className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="my-4">
          <TrackOrderButton
            variant="outline"
            className="w-full mt-2 border-zepmeds-purple text-zepmeds-purple hover:bg-zepmeds-purple/10"
            prominent={true}
          />
        </div>
        
        <div className="mt-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="monitors">Monitors</TabsTrigger>
              <TabsTrigger value="thermometers">Thermometers</TabsTrigger>
              <TabsTrigger value="therapy">Therapy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Medical Devices</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {devices.map((device, index) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-morphism rounded-xl overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="h-32 bg-gray-700 rounded-lg mb-2 overflow-hidden">
                        <img src={device.image} alt={device.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-white font-medium text-sm">{device.name}</h3>
                          <div className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 text-xs">
                            ★ {device.rating}
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs">{device.category}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            {device.discountPrice ? (
                              <div className="flex items-center">
                                <span className="text-white font-bold text-sm">₹{device.discountPrice}</span>
                                <span className="text-gray-400 text-xs line-through ml-2">₹{device.price}</span>
                              </div>
                            ) : (
                              <span className="text-white font-bold text-sm">₹{device.price}</span>
                            )}
                          </div>
                          <button
                            className="bg-zepmeds-purple text-white px-3 py-1 rounded-full text-xs"
                            onClick={() => handleAddToCart(device)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 glass-morphism rounded-xl p-4">
                <h2 className="text-lg font-bold text-white mb-3">Using Medical Devices</h2>
                
                <div className="space-y-3">
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <Microscope className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-medium">Read Instructions</h3>
                        <p className="text-gray-400 text-xs">Always read the user manual before using any medical device</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <Clock className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-medium">Regular Maintenance</h3>
                        <p className="text-gray-400 text-xs">Keep your devices calibrated and in good condition</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <Zap className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-medium">Battery Care</h3>
                        <p className="text-gray-400 text-xs">Remove batteries if the device is not in use for long periods</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="monitors" className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Health Monitors</h2>
              <div className="grid grid-cols-2 gap-4">
                {devices
                  .filter(device => device.category === "Monitors")
                  .map((device, index) => (
                    <motion.div
                      key={device.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-morphism rounded-xl overflow-hidden"
                    >
                      {/* Device card content - same as above */}
                      <div className="p-2">
                        <div className="h-32 bg-gray-700 rounded-lg mb-2 overflow-hidden">
                          <img src={device.image} alt={device.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-white font-medium text-sm">{device.name}</h3>
                            <div className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 text-xs">
                              ★ {device.rating}
                            </div>
                          </div>
                          <p className="text-gray-400 text-xs">{device.category}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              {device.discountPrice ? (
                                <div className="flex items-center">
                                  <span className="text-white font-bold text-sm">₹{device.discountPrice}</span>
                                  <span className="text-gray-400 text-xs line-through ml-2">₹{device.price}</span>
                                </div>
                              ) : (
                                <span className="text-white font-bold text-sm">₹{device.price}</span>
                              )}
                            </div>
                            <button
                              className="bg-zepmeds-purple text-white px-3 py-1 rounded-full text-xs"
                              onClick={() => handleAddToCart(device)}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="thermometers" className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Thermometers</h2>
              <div className="grid grid-cols-2 gap-4">
                {devices
                  .filter(device => device.category === "Thermometers")
                  .map((device, index) => (
                    <motion.div
                      key={device.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-morphism rounded-xl overflow-hidden"
                    >
                      {/* Device card content - same as above */}
                      <div className="p-2">
                        <div className="h-32 bg-gray-700 rounded-lg mb-2 overflow-hidden">
                          <img src={device.image} alt={device.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-white font-medium text-sm">{device.name}</h3>
                            <div className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 text-xs">
                              ★ {device.rating}
                            </div>
                          </div>
                          <p className="text-gray-400 text-xs">{device.category}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              {device.discountPrice ? (
                                <div className="flex items-center">
                                  <span className="text-white font-bold text-sm">₹{device.discountPrice}</span>
                                  <span className="text-gray-400 text-xs line-through ml-2">₹{device.price}</span>
                                </div>
                              ) : (
                                <span className="text-white font-bold text-sm">₹{device.price}</span>
                              )}
                            </div>
                            <button
                              className="bg-zepmeds-purple text-white px-3 py-1 rounded-full text-xs"
                              onClick={() => handleAddToCart(device)}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="therapy" className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Therapy Devices</h2>
              <div className="grid grid-cols-2 gap-4">
                {devices
                  .filter(device => device.category === "Therapy")
                  .map((device, index) => (
                    <motion.div
                      key={device.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-morphism rounded-xl overflow-hidden"
                    >
                      {/* Device card content - same as above */}
                      <div className="p-2">
                        <div className="h-32 bg-gray-700 rounded-lg mb-2 overflow-hidden">
                          <img src={device.image} alt={device.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-white font-medium text-sm">{device.name}</h3>
                            <div className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 text-xs">
                              ★ {device.rating}
                            </div>
                          </div>
                          <p className="text-gray-400 text-xs">{device.category}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              {device.discountPrice ? (
                                <div className="flex items-center">
                                  <span className="text-white font-bold text-sm">₹{device.discountPrice}</span>
                                  <span className="text-gray-400 text-xs line-through ml-2">₹{device.price}</span>
                                </div>
                              ) : (
                                <span className="text-white font-bold text-sm">₹{device.price}</span>
                              )}
                            </div>
                            <button
                              className="bg-zepmeds-purple text-white px-3 py-1 rounded-full text-xs"
                              onClick={() => handleAddToCart(device)}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default MedicalDevices;
