
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Camera,
  User,
  MapPin,
  ClipboardList,
  Pill,
  FileText,
  Stethoscope,
  AlertCircle,
  Headphones,
  Wallet,
  Ticket,
  LogOut,
  Edit,
  ChevronRight
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, completeProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleSaveProfile = () => {
    completeProfile(name, address);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(" ").map((n) => n[0]).join("");
    }
    return user?.phoneNumber?.slice(-2) || "ZM";
  };

  const menuItems = [
    { icon: <User size={20} />, title: "Patient Details", path: "/patient-details" },
    { icon: <MapPin size={20} />, title: "Manage Addresses", path: "/addresses" },
    { icon: <ClipboardList size={20} />, title: "Order History", path: "/orders" },
    { icon: <Pill size={20} />, title: "Past Medicines", path: "/past-medicines" },
    { icon: <FileText size={20} />, title: "Medical Reports", path: "/reports" },
    { icon: <Stethoscope size={20} />, title: "Consult a Doctor", path: "/doctor" },
    { icon: <AlertCircle size={20} />, title: "Emergency Services", path: "/emergency" },
    { icon: <Headphones size={20} />, title: "Help & Support", path: "/support" },
    { icon: <Wallet size={20} />, title: "Wallet", path: "/wallet" },
    { icon: <Ticket size={20} />, title: "Coupons & Offers", path: "/coupons" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profile" />

      <main className="px-4 py-4">
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

        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.3 }}
            >
              <button
                className="w-full glass-morphism rounded-xl p-4 flex items-center justify-between hover:border-zepmeds-purple/40 transition-colors"
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-zepmeds-purple/10 flex items-center justify-center mr-3 text-zepmeds-purple">
                    {item.icon}
                  </div>
                  <span className="text-white font-medium">{item.title}</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: menuItems.length * 0.05 + 0.3 }}
          >
            <button
              className="w-full glass-morphism rounded-xl p-4 flex items-center justify-between hover:border-red-500/40 transition-colors mt-4"
              onClick={handleLogout}
            >
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center mr-3 text-red-500">
                  <LogOut size={20} />
                </div>
                <span className="text-red-500 font-medium">Logout</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </motion.div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
