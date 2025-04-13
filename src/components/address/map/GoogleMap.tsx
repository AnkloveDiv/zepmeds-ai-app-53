
import React, { useEffect, useRef } from 'react';
import { loadGoogleMapsAPI } from '@/utils/googleMapsLoader';
import { Location } from './useMapLocation';

interface GoogleMapProps {
  location?: Location;
  onLocationChange?: (location: Location) => void;
  height?: string;
  zoom?: number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  location,
  onLocationChange,
  height = '300px',
  zoom = 16
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initMap = async () => {
      try {
        await loadGoogleMapsAPI();
        
        if (!isMounted || !mapRef.current) return;
        
        const mapOptions: google.maps.MapOptions = {
          center: location || { lat: 28.6139, lng: 77.2090 }, // Default to New Delhi
          zoom: zoom,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
        };
        
        const map = new google.maps.Map(mapRef.current, mapOptions);
        googleMapRef.current = map;
        
        // Create marker
        const marker = new google.maps.Marker({
          position: location,
          map: map,
          draggable: !!onLocationChange,
        });
        markerRef.current = marker;
        
        // Add click listener to map
        if (onLocationChange) {
          map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              const newLocation = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              };
              marker.setPosition(newLocation);
              onLocationChange(newLocation);
            }
          });
          
          // Add dragend listener to marker
          marker.addListener('dragend', () => {
            const position = marker.getPosition();
            if (position) {
              onLocationChange({
                lat: position.lat(),
                lng: position.lng()
              });
            }
          });
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };
    
    initMap();
    
    return () => {
      isMounted = false;
    };
  }, [location, onLocationChange, zoom]);
  
  // Update marker position if location changes
  useEffect(() => {
    if (markerRef.current && location) {
      markerRef.current.setPosition(location);
    }
    
    if (googleMapRef.current && location) {
      googleMapRef.current.setCenter(location);
    }
  }, [location]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="bg-gray-200"
    />
  );
};

export default GoogleMap;
