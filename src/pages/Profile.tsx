
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenu from "@/components/profile/ProfileMenu";
import LogoutButton from "@/components/profile/LogoutButton";
import { getProfileMenuItems } from "@/utils/profileMenuItems";

const Profile = () => {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleSaveProfile = () => {
    completeProfile(name, address);
    setIsEditing(false);
  };

  const menuItems = getProfileMenuItems();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profile" />

      <main className="px-4 py-4">
        <ProfileHeader 
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          name={name}
          setName={setName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          address={address}
          setAddress={setAddress}
          handleSaveProfile={handleSaveProfile}
        />

        <ProfileMenu menuItems={menuItems} />
        <LogoutButton />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
