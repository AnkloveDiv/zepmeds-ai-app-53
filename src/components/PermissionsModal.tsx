
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  MapPin, 
  HardDrive, 
  CheckCircle, 
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface PermissionsModalProps {
  onGranted: () => void;
}

const PermissionsModal = ({ onGranted }: PermissionsModalProps) => {
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    storage: false
  });

  const handleRequestPermission = async (type: 'camera' | 'location' | 'storage') => {
    try {
      if (type === 'camera') {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissions(prev => ({ ...prev, camera: true }));
      } 
      else if (type === 'location') {
        // Request location permission
        await navigator.geolocation.getCurrentPosition(() => {
          setPermissions(prev => ({ ...prev, location: true }));
        });
      }
      else if (type === 'storage') {
        // For storage, we'll just simulate a permission grant
        setPermissions(prev => ({ ...prev, storage: true }));
      }
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
    }
  };

  const allPermissionsGranted = 
    permissions.camera && 
    permissions.location && 
    permissions.storage;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md rounded-2xl glass-morphism p-6 mx-4"
      >
        <h2 className="text-2xl font-bold text-white mb-4 text-center">App Permissions</h2>
        <p className="text-gray-300 mb-6 text-center">
          Zepmeds needs the following permissions to provide you with the best experience
        </p>

        <div className="space-y-4 mb-6">
          <PermissionItem
            icon={<Camera className="h-6 w-6" />}
            title="Camera"
            description="For scanning prescriptions and uploading images"
            granted={permissions.camera}
            onRequest={() => handleRequestPermission('camera')}
          />

          <PermissionItem
            icon={<MapPin className="h-6 w-6" />}
            title="Location"
            description="To deliver medicines to your location"
            granted={permissions.location}
            onRequest={() => handleRequestPermission('location')}
          />

          <PermissionItem
            icon={<HardDrive className="h-6 w-6" />}
            title="Storage"
            description="To save prescriptions and reports"
            granted={permissions.storage}
            onRequest={() => handleRequestPermission('storage')}
          />
        </div>

        <Button 
          className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light text-white py-2 rounded-lg transition-all"
          disabled={!allPermissionsGranted}
          onClick={onGranted}
        >
          {allPermissionsGranted ? "Continue" : "Grant All Permissions"}
        </Button>
      </motion.div>
    </motion.div>
  );
};

interface PermissionItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  granted: boolean;
  onRequest: () => void;
}

const PermissionItem = ({ icon, title, description, granted, onRequest }: PermissionItemProps) => (
  <div className="flex items-start p-3 rounded-lg bg-black/20 border border-white/10">
    <div className="mr-3 mt-1 text-zepmeds-purple-light">{icon}</div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {granted ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-amber-500" />
        )}
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
    {!granted && (
      <Button 
        variant="outline" 
        className="ml-2 text-zepmeds-purple-light border-zepmeds-purple-light hover:bg-zepmeds-purple-transparent hover:text-white"
        onClick={onRequest}
      >
        Allow
      </Button>
    )}
  </div>
);

export default PermissionsModal;
