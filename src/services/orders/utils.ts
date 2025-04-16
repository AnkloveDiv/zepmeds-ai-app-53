
/**
 * Order Service Utilities
 * Common helper functions and types for order services
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Location data structure
 */
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Gets the current user's location if available
 * @returns Promise resolving to location data or null
 */
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  if (!navigator.geolocation) {
    return null;
  }
  
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
    
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy
    };
  } catch (error) {
    console.log('Could not get location:', error);
    return null;
  }
};

/**
 * Safely parses JSON strings with error handling
 * @param jsonString The JSON string to parse
 * @param defaultValue Default value to return if parsing fails
 * @returns Parsed object or default value
 */
export const safeParseJSON = <T>(jsonString: string | null | undefined, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
};

/**
 * Safely retrieves a property from an object with proper type casting
 * @param obj Object to retrieve property from
 * @param key Property key
 * @returns Property value or undefined
 */
export const getProperty = <T>(obj: any, key: string): T | undefined => {
  return obj && obj[key] !== undefined ? obj[key] as T : undefined;
};

/**
 * Sends an emergency request to the backend
 * @param name User's name
 * @param phone User's phone number
 * @param description Description of the emergency
 * @returns Promise resolving to the emergency request data or null on error
 */
export const sendEmergencyRequest = async (
  name: string, 
  phone: string, 
  description: string
): Promise<any> => {
  try {
    // Get user's location
    const locationData = await getCurrentLocation();
    
    if (!locationData) {
      console.error('Failed to get location for emergency request');
      // Still proceed, but with null location
    }
    
    // Create the emergency request object
    const emergencyRequest = {
      name,
      phone,
      notes: description || 'Emergency assistance needed',
      status: 'pending',
      location: locationData ? JSON.stringify(locationData) : null,
      timestamp: new Date().toISOString()
    };
    
    console.log('Sending emergency request:', emergencyRequest);
    
    // Insert into emergency_requests table
    const { data, error } = await supabase
      .from('emergency_requests')
      .insert(emergencyRequest)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating emergency request:', error);
      throw error;
    }
    
    console.log('Emergency request created successfully:', data);
    
    // Enable realtime updates for this record to broadcast to ambulance dashboard
    await supabase
      .from('emergency_requests')
      .on('UPDATE', (payload) => {
        console.log('Emergency request updated:', payload);
        // We can handle updates from the ambulance dashboard here
      })
      .subscribe();
    
    return data;
  } catch (error) {
    console.error('Failed to send emergency request:', error);
    return null;
  }
};
