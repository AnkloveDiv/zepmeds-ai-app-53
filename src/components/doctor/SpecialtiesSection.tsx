
import { LucideIcon, Stethoscope, Heart, Brain, Baby, User } from "lucide-react";

interface Specialty {
  name: string;
  icon: React.ReactNode;
}

interface SpecialtiesSectionProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const SpecialtiesSection = ({ activeCategory, onCategoryChange }: SpecialtiesSectionProps) => {
  const specialties: Specialty[] = [
    { name: "All", icon: <Stethoscope className="h-5 w-5" /> },
    { name: "Cardiologist", icon: <Heart className="h-5 w-5" /> },
    { name: "Neurologist", icon: <Brain className="h-5 w-5" /> },
    { name: "Dentist", icon: <Stethoscope className="h-5 w-5" /> },
    { name: "Pediatrician", icon: <Baby className="h-5 w-5" /> },
    { name: "Dermatologist", icon: <User className="h-5 w-5" /> }
  ];

  return (
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
              onClick={() => onCategoryChange(specialty.name)}
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
  );
};

export default SpecialtiesSection;
