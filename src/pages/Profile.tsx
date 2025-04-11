
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
import { MapPin, Wallet, Ticket } from "lucide-react";

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
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white text-lg font-medium mb-1">Your Orders</h3>
                <p className="text-gray-300">Track your current order</p>
              </div>
            </div>
            <TrackOrderButton 
              variant="default"
              className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/90"
              prominent={true}
            />
          </div>
        </div>
        
        {/* Wallet and coupons section */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="p-4 glass-morphism rounded-xl bg-gradient-to-br from-green-500/20 to-green-700/10">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <Wallet className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Wallet</h3>
              <p className="text-green-400 text-lg font-bold">₹500</p>
              <button 
                className="mt-2 text-xs text-white bg-green-500/20 px-3 py-1 rounded-full"
                onClick={() => navigate("/wallet")}
              >
                View
              </button>
            </div>
          </div>
          
          <div className="p-4 glass-morphism rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/10">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-2">
                <Ticket className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Coupons</h3>
              <p className="text-amber-400 text-lg font-bold">4</p>
              <button 
                className="mt-2 text-xs text-white bg-amber-500/20 px-3 py-1 rounded-full"
                onClick={() => navigate("/coupons")}
              >
                View
              </button>
            </div>
          </div>
        </div>
        
        {/* Saved locations */}
        <div className="mb-6 p-4 glass-morphism rounded-xl">
          <h3 className="text-white text-lg font-medium mb-3">Saved Locations</h3>
          <div className="space-y-3">
            <div className="flex items-start border-b border-white/10 pb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                <MapPin className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium">Home</h4>
                <p className="text-gray-400 text-xs">123 Main Street, Apartment 4B, New York, NY 10001</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-0.5">
                <MapPin className="h-4 w-4 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium">Work</h4>
                <p className="text-gray-400 text-xs">456 Business Ave, Suite 200, New York, NY 10002</p>
              </div>
            </div>
          </div>
          <button 
            className="mt-3 text-xs text-zepmeds-purple bg-zepmeds-purple/10 px-3 py-1 rounded-full w-full"
            onClick={() => navigate("/addresses")}
          >
            Manage Addresses
          </button>
        </div>

        <ProfileMenu menuItems={menuItems} />
        <LogoutButton />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
