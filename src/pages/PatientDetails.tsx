
import { useEffect } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Calendar, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import useBackNavigation from "@/hooks/useBackNavigation";

const PatientDetails = () => {
  useBackNavigation();
  const { user } = useAuth();
  
  const getInitials = () => {
    if (user?.name) {
      return user.name.split(" ").map((n) => n[0]).join("");
    }
    return user?.phoneNumber?.slice(-2) || "ZM";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Patient Details" />
      
      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-5 mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 border-2 border-zepmeds-purple">
              <AvatarImage src="" alt={user?.name || "User"} />
              <AvatarFallback className="bg-zepmeds-purple text-white text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-white">{user?.name || "Add Your Name"}</h2>
              <p className="text-gray-400">Patient ID: ZEP{user?.phoneNumber?.slice(-4) || "0000"}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <div className="flex items-center">
                <User className="h-5 w-5 text-zepmeds-purple mr-2" />
                <Input id="name" defaultValue={user?.name || ""} className="bg-black/20 border-white/10" placeholder="Your full name" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="dob" className="text-white">Date of Birth</Label>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-zepmeds-purple mr-2" />
                <Input id="dob" type="date" className="bg-black/20 border-white/10" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-white">Phone Number</Label>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-zepmeds-purple mr-2" />
                <Input id="phone" defaultValue={user?.phoneNumber || ""} className="bg-black/20 border-white/10" placeholder="Your phone number" readOnly />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-zepmeds-purple mr-2" />
                <Input id="email" type="email" className="bg-black/20 border-white/10" placeholder="Your email address" />
              </div>
            </div>
            
            <Button className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/90">Save Changes</Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="allergies" className="text-white">Allergies</Label>
                <Input id="allergies" className="bg-black/40 border-white/10" placeholder="List any allergies" />
              </div>
              
              <div>
                <Label htmlFor="conditions" className="text-white">Medical Conditions</Label>
                <Input id="conditions" className="bg-black/40 border-white/10" placeholder="List any medical conditions" />
              </div>
              
              <div>
                <Label htmlFor="blood" className="text-white">Blood Type</Label>
                <Input id="blood" className="bg-black/40 border-white/10" placeholder="Your blood type" />
              </div>
              
              <Button variant="outline" className="w-full border-zepmeds-purple text-zepmeds-purple hover:bg-zepmeds-purple/10">
                Update Medical Info
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default PatientDetails;
