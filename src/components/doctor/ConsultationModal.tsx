
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Video, Phone, MessageSquare } from "lucide-react";

interface Doctor {
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  price: number;
  available: boolean;
  bio: string;
}

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor | null;
  onStartConsultation: (type: "video" | "chat" | "audio") => void;
}

const ConsultationModal = ({ 
  open, 
  onOpenChange, 
  doctor, 
  onStartConsultation 
}: ConsultationModalProps) => {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Consult with {doctor.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-14 w-14 rounded-lg">
              <AvatarFallback className="rounded-lg bg-zepmeds-purple/20 text-zepmeds-purple">
                {doctor.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium">{doctor.name}</h3>
              <p className="text-sm text-gray-400">{doctor.specialty}</p>
              <div className="flex items-center mt-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-xs">{doctor.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-black/20 rounded-lg">
            <h4 className="font-medium mb-1">About Doctor</h4>
            <p className="text-sm text-gray-400">{doctor.bio}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Consultation Fee</h4>
            <p className="text-zepmeds-purple font-bold text-xl">₹{doctor.price}</p>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light flex justify-center items-center gap-2"
              onClick={() => onStartConsultation("video")}
            >
              <Video size={16} />
              <span>Video Call</span>
            </Button>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 flex justify-center items-center gap-2"
              onClick={() => onStartConsultation("audio")}
            >
              <Phone size={16} />
              <span>Voice Call</span>
            </Button>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 flex justify-center items-center gap-2"
              onClick={() => onStartConsultation("chat")}
            >
              <MessageSquare size={16} />
              <span>Chat</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
