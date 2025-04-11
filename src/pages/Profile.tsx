
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
import TrackOrderButton from "@/components/order/TrackOrderButton";

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

        {/* Add track order button */}
        <div className="mb-6 p-4 glass-morphism rounded-xl bg-gradient-to-br from-zepmeds-purple/20 to-purple-400/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-medium mb-1">Your Orders</h3>
              <p className="text-gray-300">Track your current order</p>
            </div>
            <TrackOrderButton 
              variant="outline"
              className="border-zepmeds-purple text-zepmeds-purple bg-white/10 hover:bg-white/20"
            />
          </div>
        </div>

        <ProfileMenu menuItems={menuItems} />
        <LogoutButton />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
