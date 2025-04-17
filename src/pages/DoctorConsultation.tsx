
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import BottomNavigation from "@/components/BottomNavigation";
import { MessageSquare, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import useBackNavigation from "@/hooks/useBackNavigation";
import { doctors, availableTimes } from "@/data/doctorData";
import DoctorCard from "@/components/doctor/DoctorCard";
import ConsultationOptions from "@/components/doctor/ConsultationOptions";
import AudioConsultationOption from "@/components/doctor/AudioConsultationOption";
import SpecialtiesSection from "@/components/doctor/SpecialtiesSection";
import ConsultationModal from "@/components/doctor/ConsultationModal";
import AppointmentModal from "@/components/doctor/AppointmentModal";
import { useConsultation } from "@/hooks/useConsultation";
import { supabase } from "@/integrations/supabase/client";

const DoctorConsultation = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [consultationType, setConsultationType] = useState<"video" | "chat" | "audio">("video");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { toast } = useToast();
  const { bookConsultation } = useConsultation();
  
  // Use the custom back navigation hook
  useBackNavigation();
  
  const handleDoctorConsult = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsConsultModalOpen(true);
  };

  const handleBookAppointment = () => {
    setIsAppointmentModalOpen(true);
  };

  // Add the missing instant consultation handler
  const handleInstantConsultation = () => {
    // Find the first available doctor
    const availableDoctor = doctors.find(doc => doc.available);
    
    if (availableDoctor) {
      setSelectedDoctor(availableDoctor);
      setIsConsultModalOpen(true);
      
      toast({
        title: "Searching for available doctors",
        description: `Connecting you with ${availableDoctor.name}...`,
        duration: 3000,
      });
    } else {
      toast({
        title: "No doctors available",
        description: "Sorry, there are no doctors available for instant consultation right now.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select both date and time for your appointment",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save appointment to database
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const isPM = selectedTime.includes('PM');
      
      if (hours < 12 && isPM) {
        appointmentDate.setHours(hours + 12);
      } else {
        appointmentDate.setHours(hours);
      }
      appointmentDate.setMinutes(minutes);
      
      // Book appointment as scheduled consultation
      const booked = await bookConsultation(selectedDoctor.name, "video");
      
      if (booked) {
        toast({
          title: "Appointment Booked",
          description: `Your appointment with ${selectedDoctor?.name} is confirmed for ${selectedDate.toDateString()} at ${selectedTime}`,
          duration: 5000,
        });
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Could not book your appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAppointmentModalOpen(false);
    }
  };

  const startConsultation = (type: "video" | "chat" | "audio") => {
    setConsultationType(type);
    
    toast({
      title: `Starting ${type} consultation`,
      description: `Connecting you with ${selectedDoctor?.name}...`,
      duration: 3000,
    });
    
    setIsConsultModalOpen(false);
    
    // The actual consultation handling is now in ConsultationModal component
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
              <ConsultationOptions 
                onBookAppointment={handleBookAppointment} 
                onInstantConsultation={handleInstantConsultation}
              />
              <AudioConsultationOption onClick={handleInstantConsultation} />
            </TabsContent>
            
            <TabsContent value="chat">
              <div className="glass-morphism rounded-xl p-4 mb-6 cursor-pointer" onClick={handleInstantConsultation}>
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
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <SpecialtiesSection 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <div className="mt-4">
          <h2 className="text-xl font-bold text-white mb-4">Available Doctors</h2>
          
          <div className="space-y-4">
            {doctors
              .filter(doctor => activeCategory === "All" || doctor.specialty === activeCategory)
              .map((doctor, index) => (
                <motion.div
                  key={doctor.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <DoctorCard
                    name={doctor.name}
                    specialty={doctor.specialty}
                    experience={doctor.experience.toString()}
                    rating={doctor.rating}
                    price={doctor.price.toString()}
                    available={doctor.available}
                    onConsult={() => handleDoctorConsult(doctor)}
                  />
                </motion.div>
              ))}
          </div>
        </div>
      </main>
      
      {/* Doctor Consultation Modal */}
      <ConsultationModal 
        open={isConsultModalOpen}
        onOpenChange={setIsConsultModalOpen}
        doctor={selectedDoctor}
        onStartConsultation={startConsultation}
      />
      
      {/* Appointment Booking Modal */}
      <AppointmentModal 
        open={isAppointmentModalOpen}
        onOpenChange={setIsAppointmentModalOpen}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedTime={selectedTime}
        onTimeChange={setSelectedTime}
        onConfirm={handleConfirmAppointment}
        availableTimes={availableTimes}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default DoctorConsultation;
