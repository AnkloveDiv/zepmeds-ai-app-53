
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { initializeMap } from "@/utils/googleMapsLoader";

interface DeliveryMapProps {
  showRider?: boolean;
  orderId?: string;
}

const DeliveryMap = ({ showRider = true, orderId }: DeliveryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(2.4);
  const [eta, setEta] = useState(15);
  const [animating, setAnimating] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [riderMarker, setRiderMarker] = useState<google.maps.Marker | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<google.maps.Marker | null>(null);
  const [storeMarker, setStoreMarker] = useState<google.maps.Marker | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.Polyline | null>(null);
  const { toast } = useToast();

  // Simulated coordinates for demonstration
  const storeCoords = { lat: 28.6139, lng: 77.2090 }; // Store location
  const destinationCoords = { lat: 28.6239, lng: 77.2290 }; // Delivery destination
  const initialRiderCoords = { lat: 28.6180, lng: 77.2160 }; // Initial rider position

  useEffect(() => {
    // Initialize map when component mounts
    const setupMap = async () => {
      await initializeMap();
      
      if (mapRef.current && window.google && window.google.maps) {
        try {
          // Create Google Map
          const googleMap = new google.maps.Map(mapRef.current, {
            center: initialRiderCoords,
            zoom: 14,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: false
          });
          
          setMap(googleMap);
          
          // Store marker (origin)
          const storeIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#9b87f5',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 8
          };
          
          const store = new google.maps.Marker({
            position: storeCoords,
            map: googleMap,
            icon: storeIcon,
            title: 'Store'
          });
          
          setStoreMarker(store);
          
          // Destination marker
          const destinationIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#FF4500',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 8
          };
          
          const destination = new google.maps.Marker({
            position: destinationCoords,
            map: googleMap,
            icon: destinationIcon,
            title: 'Your Location'
          });
          
          setDestinationMarker(destination);
          
          // Draw route between store and destination
          const routeCoordinates = [
            storeCoords,
            initialRiderCoords,
            destinationCoords
          ];
          
          const path = new google.maps.Polyline({
            path: routeCoordinates,
            geodesic: true,
            strokeColor: '#9b87f5',
            strokeOpacity: 0.7,
            strokeWeight: 4,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                strokeWeight: 4,
                scale: 3
              },
              offset: '0',
              repeat: '20px'
            }]
          });
          
          path.setMap(googleMap);
          setRoutePath(path);
          
          // Add a moving marker for the rider if showRider is true
          if (showRider) {
            const riderIcon = {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#FF9500',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
              scale: 8
            };
            
            const rider = new google.maps.Marker({
              position: initialRiderCoords,
              map: googleMap,
              icon: riderIcon,
              title: `${eta} min`
            });
            
            setRiderMarker(rider);
            
            // Fit map to show all markers
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(storeCoords);
            bounds.extend(destinationCoords);
            bounds.extend(initialRiderCoords);
            googleMap.fitBounds(bounds, 30);
            
            // Start animation
            startRiderAnimation();
          } else {
            // Just fit the map to store and destination
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(storeCoords);
            bounds.extend(destinationCoords);
            googleMap.fitBounds(bounds, 30);
          }
        } catch (error) {
          console.error("Error initializing map:", error);
          renderFallbackMap();
        }
      } else {
        console.error("Google Maps not available or map container not found");
        renderFallbackMap();
      }
    };
    
    setupMap();
    
    return () => {
      // Clean up map markers
      if (riderMarker) riderMarker.setMap(null);
      if (storeMarker) storeMarker.setMap(null);
      if (destinationMarker) destinationMarker.setMap(null);
      if (routePath) routePath.setMap(null);
    };
  }, []);

  const renderFallbackMap = () => {
    if (mapRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = mapRef.current.clientWidth;
      canvas.height = mapRef.current.clientHeight;
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(canvas);
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw a simple placeholder map
        ctx.fillStyle = "#1A1F2C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw some road lines
        ctx.strokeStyle = "#2E3345";
        ctx.lineWidth = 8;
        
        // Horizontal roads
        for (let y = 30; y < canvas.height; y += 60) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        // Vertical roads
        for (let x = 30; x < canvas.width; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        // Draw store location
        ctx.fillStyle = "#9b87f5";
        ctx.beginPath();
        ctx.arc(canvas.width * 0.2, canvas.height * 0.3, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Label for store
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px Arial";
        ctx.fillText("Store", canvas.width * 0.2 - 15, canvas.height * 0.3 - 15);
        
        // Draw delivery path
        ctx.strokeStyle = "#9b87f5";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.2, canvas.height * 0.3);
        ctx.lineTo(canvas.width * 0.4, canvas.height * 0.3);
        ctx.lineTo(canvas.width * 0.4, canvas.height * 0.6);
        ctx.lineTo(canvas.width * 0.7, canvas.height * 0.6);
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        
        // Draw user location
        ctx.setLineDash([]);
        ctx.fillStyle = "#FF6B6B";
        ctx.beginPath();
        ctx.arc(canvas.width * 0.7, canvas.height * 0.6, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Label for user location
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px Arial";
        ctx.fillText("Your Location", canvas.width * 0.7 - 40, canvas.height * 0.6 - 15);
        
        // Draw distance indicator
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "14px Arial Bold";
        ctx.fillText(`${distance.toFixed(1)} km`, canvas.width * 0.45, canvas.height * 0.45);
        
        if (showRider) {
          // Draw rider (simple icon)
          let riderX = canvas.width * 0.3;
          let riderY = canvas.height * 0.3;

          // Draw rider head
          ctx.fillStyle = "#FF9500";
          ctx.beginPath();
          ctx.arc(riderX, riderY, 6, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw helmet
          ctx.fillStyle = "#2E3345";
          ctx.beginPath();
          ctx.arc(riderX, riderY, 7, Math.PI, Math.PI * 2);
          ctx.fill();
          
          // ETA indicator
          ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
          ctx.roundRect(riderX - 25, riderY - 25, 50, 20, 5);
          ctx.fill();
          
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "12px Arial";
          ctx.fillText(`${eta} min`, riderX - 15, riderY - 12);
        }
      }
    }
  };

  const startRiderAnimation = () => {
    if (!riderMarker || animating || !map) return;
    
    setAnimating(true);
    
    // Define waypoints for the rider to travel (from store to destination)
    const waypoints = [
      initialRiderCoords,
      {lat: initialRiderCoords.lat + 0.001, lng: initialRiderCoords.lng + 0.002},
      {lat: initialRiderCoords.lat + 0.003, lng: initialRiderCoords.lng + 0.003},
      {lat: initialRiderCoords.lat + 0.005, lng: initialRiderCoords.lng + 0.0025},
      {lat: destinationCoords.lat - 0.002, lng: destinationCoords.lng - 0.001},
      destinationCoords
    ];
    
    let currentWaypoint = 0;
    let startTime = Date.now();
    const totalTime = 60000; // 60 seconds for full animation
    const waypointInterval = totalTime / (waypoints.length - 1);
    
    const animationInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      
      const distanceToDestReduction = 0.1;
      const etaReduction = 1;
      
      // Update distance and ETA
      setDistance(prevDistance => {
        const newDistance = prevDistance - distanceToDestReduction;
        return newDistance > 0.1 ? newDistance : 0.1;
      });
      
      setEta(prevEta => {
        const newEta = prevEta - etaReduction;
        return newEta > 1 ? newEta : 1;
      });
      
      // Update rider position
      const currentSegment = Math.floor(elapsedTime / waypointInterval);
      if (currentSegment >= waypoints.length - 1) {
        // Animation complete
        clearInterval(animationInterval);
        riderMarker.setPosition(waypoints[waypoints.length - 1]);
        return;
      }
      
      // Interpolate position between waypoints
      const segmentElapsedTime = elapsedTime % waypointInterval;
      const segmentProgress = segmentElapsedTime / waypointInterval;
      
      const startPoint = waypoints[currentSegment];
      const endPoint = waypoints[currentSegment + 1];
      
      const lat = startPoint.lat + (endPoint.lat - startPoint.lat) * segmentProgress;
      const lng = startPoint.lng + (endPoint.lng - startPoint.lng) * segmentProgress;
      
      riderMarker.setPosition({ lat, lng });
      
      // Update marker title with ETA
      riderMarker.setTitle(`${eta} min`);
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(animationInterval);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full"></div>
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        ETA: {eta} min
      </div>
    </div>
  );
};

export default DeliveryMap;
