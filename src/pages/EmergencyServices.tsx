import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Ambulance, Phone, MapPin } from 'lucide-react';

const EmergencyServices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    const getLocation = async () => {
      try {
        let location;
        if (Capacitor.isNativePlatform()) {
          // Use Capacitor's Geolocation for native platforms
          const result = await Geolocation.getCurrentPosition();
          location = {
            lat: result.coords.latitude,
            lng: result.coords.longitude
          };
        } else {
          // Fallback to browser geolocation for web
          location = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }),
              (error) => reject(error)
            );
          });
        }
        
        setUserLocation(location);
        setLocationError('');
      } catch (error) {
        console.error("Error getting location:", error);
        setLocationError("Couldn't get your location. Please enable location services.");
        toast.error("Please enable location services for emergency assistance");
      }
    };

    getLocation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmText.toLowerCase() !== 'yes') {
      toast.error("Please type 'yes' to confirm emergency services");
      return;
    }
    
    if (!userLocation) {
      toast.error("Location is required for emergency services");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('emergency_requests')
        .insert([
          { 
            name: user?.name || 'Unknown',
            phone: user?.phoneNumber || 'Unknown',
            notes: description,
            status: 'pending',
            location: JSON.stringify({
              latitude: userLocation.lat,
              longitude: userLocation.lng
            })
          }
        ])
        .select();

      if (error) {
        console.error("Error submitting emergency request:", error);
        toast.error("Failed to request emergency services. Please try again.");
        return;
      }

      toast.success("Emergency request submitted successfully");
      navigate('/dashboard', { state: { emergencyRequested: true } });
    } catch (err) {
      console.error("Exception when submitting emergency request:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const EmergencyOption = ({ 
    icon, 
    title, 
    description, 
    actionText, 
    actionFn 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    actionText: string; 
    actionFn: () => void 
  }) => (
    <div className="flex items-center justify-between bg-black/80 rounded-xl p-4 border border-gray-800">
      <div className="flex items-center">
        <div className="h-10 w-10 bg-black/80 rounded-full flex items-center justify-center mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-white font-medium">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      <button 
        onClick={actionFn}
        className="bg-transparent text-white border border-gray-700 px-4 py-1 rounded-lg hover:bg-gray-800 transition-colors text-sm"
      >
        {actionText}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 p-4">
      <div className="max-w-lg mx-auto w-full">
        <div className="bg-black/90 rounded-3xl p-6 shadow-lg border border-red-800/30 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-red-900/50 rounded-full flex items-center justify-center mr-4">
              <Ambulance className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Emergency Assistance</h1>
              <p className="text-gray-400">For life-threatening emergencies</p>
            </div>
          </div>
          
          <p className="text-gray-200 mb-6">
            This will dispatch emergency medical services to your current location immediately. 
            Only use this service for genuine medical emergencies.
          </p>
          
          {locationError && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-4">
              <p>{locationError}</p>
              <p className="font-bold">Please enable location services to continue.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-gray-200 mb-2">
                Describe your emergency (optional)
              </label>
              <Textarea
                id="description"
                placeholder="What's happening? Any relevant medical information..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-black/70 border-red-900/50 text-white resize-none"
              />
            </div>
            
            <div>
              <label htmlFor="confirm" className="block text-gray-200 mb-2">
                Type "yes" to confirm emergency services
              </label>
              <Input
                id="confirm"
                placeholder="Type 'yes' to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full bg-black/70 border-red-900/50 text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || !userLocation}
            >
              {isLoading ? "Processing..." : "Request Emergency Services"}
            </button>
          </form>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-white text-xl font-semibold mb-4">Other Emergency Services</h2>
          
          <EmergencyOption
            icon={<Phone className="text-red-400 h-5 w-5" />}
            title="Emergency Hotline"
            description="Medical emergency: 102"
            actionText="Call Now"
            actionFn={() => window.open('tel:102')}
          />
          
          <EmergencyOption
            icon={<MapPin className="text-blue-400 h-5 w-5" />}
            title="Nearest Hospitals"
            description="Find hospitals near you"
            actionText="View Map"
            actionFn={() => toast.info("Hospital map feature will open here")}
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;
