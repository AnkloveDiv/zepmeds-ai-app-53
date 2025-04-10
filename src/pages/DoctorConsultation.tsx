
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
  User,
  Phone
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";

const placeholderImg = "/placeholder.svg";

interface DoctorCardProps {
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  price: number;
  image?: string;
  available?: boolean;
  onConsult: () => void;
}

const DoctorCard = ({
  name,
  specialty,
  experience,
  rating,
  price,
  image,
  available = true,
  onConsult
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
            onClick={onConsult}
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
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [consultationType, setConsultationType] = useState<"video" | "chat" | "audio">("video");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { toast } = useToast();
  
  const specialties = [
    { name: "All", icon: <Stethoscope className="h-5 w-5" /> },
    { name: "Cardiologist", icon: <Heart className="h-5 w-5" /> },
    { name: "Neurologist", icon: <Brain className="h-5 w-5" /> },
    { name: "Dentist", icon: <DentalIcon className="h-5 w-5" /> },
    { name: "Pediatrician", icon: <Baby className="h-5 w-5" /> },
    { name: "Dermatologist", icon: <User className="h-5 w-5" /> }
  ];
  
  const doctors = [
    { name: "Dr. Sharma", specialty: "Cardiologist", experience: 12, rating: 4.8, price: 600, available: true, bio: "Specialist in cardiovascular diseases with over 12 years of experience. MBBS, MD from AIIMS." },
    { name: "Dr. Patel", specialty: "Neurologist", experience: 8, rating: 4.6, price: 800, available: true, bio: "Expert in neurological disorders and brain health. Trained at John Hopkins University." },
    { name: "Dr. Reddy", specialty: "Dentist", experience: 10, rating: 4.9, price: 500, available: false, bio: "Dental surgeon specializing in cosmetic dentistry and oral health." },
    { name: "Dr. Kumar", specialty: "Pediatrician", experience: 15, rating: 4.7, price: 700, available: true, bio: "Child health specialist with focus on developmental pediatrics and preventive care." }
  ];

  const availableTimes = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM", 
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ];
  
  const handleDoctorConsult = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsConsultModalOpen(true);
  };

  const handleBookAppointment = () => {
    setIsAppointmentModalOpen(true);
  };

  const handleConfirmAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both date and time for your appointment",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Appointment Booked",
      description: `Your appointment with ${selectedDoctor?.name} is confirmed for ${selectedDate.toDateString()} at ${selectedTime}`,
      duration: 5000,
    });
    
    setIsAppointmentModalOpen(false);
  };

  const startConsultation = (type: "video" | "chat" | "audio") => {
    setConsultationType(type);
    
    toast({
      title: `Starting ${type} consultation`,
      description: `Connecting you with ${selectedDoctor?.name}...`,
      duration: 3000,
    });
    
    setIsConsultModalOpen(false);
    
    // In a real app, this would initiate the actual consultation
  };
  
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
              <motion.div 
                className="glass-morphism rounded-xl p-4 mb-6 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={handleBookAppointment}
              >
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
              </motion.div>
              
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
                  onConsult={() => handleDoctorConsult(doctor)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Doctor Consultation Modal */}
      <Dialog open={isConsultModalOpen} onOpenChange={setIsConsultModalOpen}>
        <DialogContent className="bg-background border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Consult with {selectedDoctor?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-14 w-14 rounded-lg">
                <AvatarFallback className="rounded-lg bg-zepmeds-purple/20 text-zepmeds-purple">
                  {selectedDoctor?.name.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-medium">{selectedDoctor?.name}</h3>
                <p className="text-sm text-gray-400">{selectedDoctor?.specialty}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-xs">{selectedDoctor?.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4 p-3 bg-black/20 rounded-lg">
              <h4 className="font-medium mb-1">About Doctor</h4>
              <p className="text-sm text-gray-400">{selectedDoctor?.bio}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Consultation Fee</h4>
              <p className="text-zepmeds-purple font-bold text-xl">₹{selectedDoctor?.price}</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light flex justify-center items-center gap-2"
                onClick={() => startConsultation("video")}
              >
                <Video size={16} />
                <span>Video Call</span>
              </Button>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 flex justify-center items-center gap-2"
                onClick={() => startConsultation("audio")}
              >
                <Phone size={16} />
                <span>Voice Call</span>
              </Button>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 flex justify-center items-center gap-2"
                onClick={() => startConsultation("chat")}
              >
                <MessageSquare size={16} />
                <span>Chat</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Appointment Booking Modal */}
      <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
        <DialogContent className="bg-background border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Book an Appointment</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h4 className="font-medium mb-2">Select a Date</h4>
              <div className="rounded-lg overflow-hidden bg-black/20 p-2">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Select a Time</h4>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={`${
                      selectedTime === time 
                        ? "bg-zepmeds-purple hover:bg-zepmeds-purple-light" 
                        : "border-gray-700 text-gray-400"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light"
              onClick={handleConfirmAppointment}
            >
              Confirm Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default DoctorConsultation;
