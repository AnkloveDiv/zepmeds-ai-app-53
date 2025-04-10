
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Edit } from "lucide-react";

interface ProfileHeaderProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  name: string;
  setName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  handleSaveProfile: () => void;
}

const ProfileHeader = ({
  isEditing,
  setIsEditing,
  name,
  setName,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  handleSaveProfile
}: ProfileHeaderProps) => {
  const { user } = useAuth();

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(" ").map((n) => n[0]).join("");
    }
    return user?.phoneNumber?.slice(-2) || "ZM";
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
          <Avatar className="h-16 w-16 mr-4 border-2 border-zepmeds-purple">
            <AvatarImage src="" alt={user?.name || "User"} />
            <AvatarFallback className="bg-zepmeds-purple text-white text-xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          {isEditing ? (
            <div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-2 bg-black/20 border-white/10"
                placeholder="Your Name"
              />
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-black/20 border-white/10"
                placeholder="Phone Number"
                disabled
              />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user?.name || "Add Your Name"}
              </h2>
              <p className="text-gray-400">+91 {user?.phoneNumber}</p>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <Button
            onClick={handleSaveProfile}
            className="bg-zepmeds-purple hover:bg-zepmeds-purple-light"
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-white/10 text-white"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={18} />
          </Button>
        )}
      </div>
      
      {isEditing && (
        <div className="mt-3">
          <label className="text-sm text-gray-400 mb-1 block">Address</label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-black/20 border-white/10"
            placeholder="Your Address"
          />
        </div>
      )}
      
      <Button
        variant="ghost"
        className="w-full mt-3 flex items-center justify-center gap-2 text-white hover:bg-white/5"
        onClick={() => {}}
      >
        <Camera size={18} />
        <span>Change Profile Photo</span>
      </Button>
    </motion.div>
  );
};

export default ProfileHeader;
