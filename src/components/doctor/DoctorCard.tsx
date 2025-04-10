
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

export default DoctorCard;
