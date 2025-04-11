
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Edit } from "lucide-react";
import EditProfileForm from "@/components/profile/EditProfileForm";

interface ProfileHeaderProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const ProfileHeader = ({
  isEditing,
  setIsEditing,
}: ProfileHeaderProps) => {
  const { user } = useAuth();

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(" ").map((n) => n[0]).join("");
    }
    return user?.phoneNumber?.slice(-2) || "ZM";
  };

  // Generate a random color for the avatar
  const getRandomColor = () => {
    const colors = [
      "bg-red-500", "bg-green-500", "bg-blue-500", 
      "bg-yellow-500", "bg-purple-500", "bg-pink-500", 
      "bg-indigo-500", "bg-orange-500", "bg-teal-500"
    ];
    
    // Use user phone number as a seed for consistent color
    // since id doesn't exist in the User type
    const seed = user?.phoneNumber || "";
    const index = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-morphism rounded-xl p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Avatar className={`h-16 w-16 mr-4 border-2 border-white/20`}>
            <AvatarImage src="" alt={user?.name || "User"} />
            <AvatarFallback className={`${getRandomColor()} text-white text-xl`}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          {!isEditing && (
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user?.name || "Add Your Name"}
              </h2>
              <p className="text-gray-400">+91 {user?.phoneNumber}</p>
            </div>
          )}
        </div>
        
        {!isEditing && (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-white/10 text-white bg-zepmeds-purple/20 hover:bg-zepmeds-purple/30"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={18} className="text-zepmeds-purple" />
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <EditProfileForm
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Button
          variant="ghost"
          className="w-full mt-3 flex items-center justify-center gap-2 text-white hover:bg-white/5"
          onClick={() => {}}
        >
          <Camera size={18} className="text-amber-400" />
          <span>Change Profile Photo</span>
        </Button>
      )}
    </motion.div>
  );
};

export default ProfileHeader;
