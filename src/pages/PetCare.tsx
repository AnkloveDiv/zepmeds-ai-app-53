
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import SearchBar from "@/components/SearchBar";
import TrackOrderButton from "@/components/order/TrackOrderButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dog, Cat, Pill, Stethoscope, User, Bird, Rabbit, ShoppingBag, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const PetCare = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  const vetSpecialists = [
    { name: "Dr. Sarah Wilson", specialty: "Dogs & Cats", experience: "8 years", rating: 4.9, available: true, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { name: "Dr. Michael Chen", specialty: "Exotic Pets", experience: "12 years", rating: 4.8, available: true, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { name: "Dr. Emily Rodriguez", specialty: "Birds & Small Animals", experience: "6 years", rating: 4.7, available: false, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
  ];
  
  const petMedicines = [
    { id: "pm1", name: "Flea & Tick Prevention", category: "Dogs", price: 599, discountPrice: 499, rating: 4.6, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { id: "pm2", name: "Joint Health Supplements", category: "Cats", price: 799, discountPrice: 699, rating: 4.5, image: "https://images.unsplash.com/photo-1606208427998-5b14efa5dd53?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { id: "pm3", name: "Digestive Health Chews", category: "Dogs", price: 349, discountPrice: null, rating: 4.3, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
    { id: "pm4", name: "Calming Treats", category: "Birds", price: 299, discountPrice: 249, rating: 4.4, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
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
  
  const handleVetConsult = (vet: any) => {
    navigate('/doctor', { state: { specialistType: 'vet', specialist: vet } });
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Pet Care" />
      
      <main className="px-4 py-4">
        <SearchBar placeholder="Search for pet medicines, products..." />
        
        <div className="mt-6 glass-morphism rounded-xl p-4 bg-gradient-to-br from-amber-500/20 to-orange-400/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-medium mb-1">Pet Health First</h3>
              <p className="text-gray-300">20% off on all pet medications</p>
            </div>
            <div className="h-12 w-12 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Dog className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="dogs">Dogs</TabsTrigger>
              <TabsTrigger value="cats">Cats</TabsTrigger>
              <TabsTrigger value="others">Others</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Pet Medicines</h2>
              
              <div className="space-y-4">
                {petMedicines.map((medicine, index) => (
                  <motion.div
                    key={medicine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-morphism rounded-xl overflow-hidden"
                  >
                    <div className="flex p-2">
                      <div className="w-20 h-20 rounded-lg bg-gray-700 mr-3 overflow-hidden">
                        <img src={medicine.image} alt={medicine.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-medium">{medicine.name}</h3>
                            <p className="text-gray-400 text-sm">For {medicine.category}</p>
                          </div>
                          <div className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 text-xs">
                            ★ {medicine.rating}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            {medicine.discountPrice ? (
                              <div className="flex items-center">
                                <span className="text-white font-bold">₹{medicine.discountPrice}</span>
                                <span className="text-gray-400 text-xs line-through ml-2">₹{medicine.price}</span>
                              </div>
                            ) : (
                              <span className="text-white font-bold">₹{medicine.price}</span>
                            )}
                          </div>
                          <button
                            className="bg-zepmeds-purple text-white px-3 py-1 rounded-full text-sm"
                            onClick={() => handleAddToCart(medicine)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-4 mt-6">Consult Vet Specialists</h2>
              
              <div className="space-y-4">
                {vetSpecialists.map((vet, index) => (
                  <motion.div
                    key={vet.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-morphism rounded-xl overflow-hidden p-4"
                  >
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-full bg-gray-700 mr-3 overflow-hidden">
                        <img src={vet.image} alt={vet.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-white font-medium">{vet.name}</h3>
                            <p className="text-gray-400 text-sm">{vet.specialty} • {vet.experience}</p>
                          </div>
                          <div className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 text-xs flex items-center">
                            ★ {vet.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-3">
                      <div className="flex items-center">
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Consultation Fee: ₹599
                        </div>
                        {vet.available ? (
                          <span className="text-green-400 text-xs ml-2">Available Now</span>
                        ) : (
                          <span className="text-gray-400 text-xs ml-2">Available in 2 hours</span>
                        )}
                      </div>
                      <button
                        className="bg-zepmeds-purple text-white px-3 py-1 rounded-full text-sm"
                        onClick={() => handleVetConsult(vet)}
                      >
                        Consult
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 glass-morphism rounded-xl p-4">
                <h2 className="text-lg font-bold text-white mb-3">Pet Care Tips</h2>
                
                <div className="space-y-3">
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <Dog className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-medium">Regular Vet Check-ups</h3>
                        <p className="text-gray-400 text-xs">Schedule regular check-ups even if your pet seems healthy</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <Pill className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-medium">Medication Schedule</h3>
                        <p className="text-gray-400 text-xs">Keep track of your pet's medication schedule</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <Stethoscope className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-medium">Recognize Emergency Signs</h3>
                        <p className="text-gray-400 text-xs">Learn to recognize signs that require immediate vet attention</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="dogs" className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Dog Care Products</h2>
              {/* Filtered dog content would go here */}
              <div className="p-4 text-center text-gray-400">
                <Dog className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                <p>Dog specific content will display here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="cats" className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Cat Care Products</h2>
              {/* Filtered cat content would go here */}
              <div className="p-4 text-center text-gray-400">
                <Cat className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                <p>Cat specific content will display here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="others" className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Other Pets</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-morphism rounded-xl p-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                    <Bird className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-white text-sm font-medium">Birds</h3>
                </div>
                
                <div className="glass-morphism rounded-xl p-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                    <Rabbit className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-white text-sm font-medium">Small Pets</h3>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default PetCare;
