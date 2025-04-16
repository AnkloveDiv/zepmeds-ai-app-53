
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

const EmergencyServices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
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
    
    if (!userLocation) {
      toast.error("Location is required for emergency services");
      return;
    }
    
    if (!name || !phoneNumber) {
      toast.error("Please provide your name and phone number");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('emergency_requests')
        .insert([
          { 
            name,
            phone: phoneNumber,
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

  return (
    <div className="flex flex-col min-h-screen bg-zepmeds-light-bg">
      <div className="flex-1 p-4">
        <div className="max-w-lg mx-auto mt-8">
          <Card className="shadow-lg border-red-500 border-2">
            <CardHeader className="bg-red-500 text-white">
              <CardTitle className="text-2xl font-bold text-center">Emergency Services</CardTitle>
              <CardDescription className="text-white text-center">
                Request immediate medical assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {locationError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{locationError}</p>
                  <p className="font-bold">Please enable location services to continue.</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium">
                    Emergency Description (Optional)
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe the emergency situation"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                {userLocation ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                    Location detected successfully. Help will be sent to your current location.
                  </div>
                ) : (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
                    Detecting your location...
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading || !userLocation}
                >
                  {isLoading ? "Processing..." : "Request Emergency Help"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="bg-gray-50 text-sm text-gray-500 text-center">
              <p className="w-full">
                For life-threatening emergencies, please also call your local emergency services directly.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;
