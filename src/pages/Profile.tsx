
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenu from "@/components/profile/ProfileMenu";
import LogoutButton from "@/components/profile/LogoutButton";
import { getProfileMenuItems } from "@/utils/profileMenuItems";
import useBackNavigation from "@/hooks/useBackNavigation";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Use the back navigation hook
  useBackNavigation();

  const menuItems = getProfileMenuItems();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profile" showBackButton />

      <main className="px-4 py-4">
        <ProfileHeader 
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />

        <ProfileMenu menuItems={menuItems} />
        <LogoutButton />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
