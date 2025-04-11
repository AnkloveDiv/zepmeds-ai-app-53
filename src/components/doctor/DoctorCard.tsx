
import { motion } from "framer-motion";
import { Video, MessageSquare, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DoctorCardProps {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  price: number;
  available: boolean;
  image?: string;
  onConsult: () => void;
}

const DoctorCard = ({
  name,
  specialty,
  experience,
  rating,
  price,
  available,
  image = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  onConsult
}: DoctorCardProps) => {
  return (
    <motion.div 
      className="glass-morphism rounded-xl p-4"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center">
        <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-medium">{name}</h3>
              <p className="text-gray-400 text-sm">{specialty} • {experience}</p>
            </div>
            <Badge variant="outline" className="text-white border-white/20 flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
              {rating}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="text-white border-white/20 bg-white/5">
          <Video className="h-3 w-3 mr-1" />
          Video Consult
        </Badge>
        
        <Badge variant="outline" className="text-white border-white/20 bg-white/5">
          <MessageSquare className="h-3 w-3 mr-1" />
          Chat
        </Badge>
        
        <Badge variant="outline" className="text-white border-white/20 bg-white/5">
          <Users className="h-3 w-3 mr-1" />
          {Math.floor(Math.random() * 500) + 100} patients
        </Badge>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
            ₹{price} Consultation Fee
          </span>
          {available ? (
            <span className="text-green-400 text-xs mt-1">Available Now</span>
          ) : (
            <span className="text-gray-400 text-xs mt-1">Available in 30 mins</span>
          )}
        </div>
        
        <Button 
          size="sm" 
          className="bg-zepmeds-purple hover:bg-zepmeds-purple/90"
          onClick={onConsult}
        >
          Consult
        </Button>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
