
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import BottomNavigation from "@/components/BottomNavigation";
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Star,
  ChevronRight,
  Heart,
  Brain,
  Stethoscope,
  Stethoscope as DentalIcon,
  Baby,
  User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const placeholderImg = "/placeholder.svg";

interface DoctorCardProps {
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  price: number;
  image?: string;
  available?: boolean;
}

const DoctorCard = ({
  name,
  specialty,
  experience,
  rating,
  price,
  image,
  available = true
}: DoctorCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass-morphism rounded-xl overflow-hidden card-glow"
    >
      <div className="p-4">
        <div className="flex items-start">
          <Avatar className="h-16 w-16 mr-3 rounded-lg">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="rounded-lg bg-zepmeds-purple/20 text-zepmeds-purple">
              {name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-medium text-white text-lg">{name}</h3>
            <p className="text-gray-400 text-sm">{specialty}</p>
            
            <div className="flex items-center mt-1 text-sm text-gray-400">
              <span className="mr-3">{experience} yrs exp</span>
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{rating}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xs text-gray-400">Consultation Fee</p>
            <p className="text-zepmeds-purple font-bold">₹{price}</p>
          </div>
          
          <Button
            className="bg-zepmeds-purple hover:bg-zepmeds-purple-light"
            disabled={!available}
          >
            {available ? "Consult Now" : "Not Available"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const DoctorConsultation = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const specialties = [
    { name: "All", icon: <Stethoscope className="h-5 w-5" /> },
    { name: "Cardiologist", icon: <Heart className="h-5 w-5" /> },
    { name: "Neurologist", icon: <Brain className="h-5 w-5" /> },
    { name: "Dentist", icon: <DentalIcon className="h-5 w-5" /> },
    { name: "Pediatrician", icon: <Baby className="h-5 w-5" /> },
    { name: "Dermatologist", icon: <User className="h-5 w-5" /> }
  ];
  
  const doctors = [
    { name: "Dr. Sharma", specialty: "Cardiologist", experience: 12, rating: 4.8, price: 600, available: true },
    { name: "Dr. Patel", specialty: "Neurologist", experience: 8, rating: 4.6, price: 800, available: true },
    { name: "Dr. Reddy", specialty: "Dentist", experience: 10, rating: 4.9, price: 500, available: false },
    { name: "Dr. Kumar", specialty: "Pediatrician", experience: 15, rating: 4.7, price: 700, available: true }
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Doctor Consultation" />
      
      <main className="px-4 py-4">
        <SearchBar placeholder="Search for doctors, specialties..." />
        
        <div className="mt-6">
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video size={16} />
                <span>Video Consult</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Chat Consult</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="video">
              <div className="glass-morphism rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-zepmeds-purple/10 flex items-center justify-center mr-3 text-zepmeds-purple">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Book Appointment</h3>
                      <p className="text-gray-400 text-sm">Schedule at your convenience</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
              
              <div className="glass-morphism rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-zepmeds-purple/10 flex items-center justify-center mr-3 text-zepmeds-purple">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Instant Consultation</h3>
                      <p className="text-gray-400 text-sm">Connect with available doctors</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chat">
              <div className="glass-morphism rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-zepmeds-purple/10 flex items-center justify-center mr-3 text-zepmeds-purple">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Start a Chat</h3>
                      <p className="text-gray-400 text-sm">Message doctors anytime</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Top Specialties</h2>
          
          <div className="overflow-x-auto scrollbar-none -mx-4 px-4 mb-6">
            <div className="flex space-x-3">
              {specialties.map((specialty) => (
                <button
                  key={specialty.name}
                  className={`flex flex-col items-center space-y-2 min-w-max ${
                    activeCategory === specialty.name ? "opacity-100" : "opacity-70"
                  }`}
                  onClick={() => setActiveCategory(specialty.name)}
                >
                  <div 
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      activeCategory === specialty.name 
                        ? "bg-zepmeds-purple text-white" 
                        : "bg-black/20 text-gray-300"
                    }`}
                  >
                    {specialty.icon}
                  </div>
                  <span className="text-xs text-white">{specialty.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h2 className="text-xl font-bold text-white mb-4">Available Doctors</h2>
          
          <div className="space-y-4">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <DoctorCard
                  name={doctor.name}
                  specialty={doctor.specialty}
                  experience={doctor.experience}
                  rating={doctor.rating}
                  price={doctor.price}
                  available={doctor.available}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default DoctorConsultation;
