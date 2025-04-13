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
  const [map, setMap] = useState<any | null>(null);
  const [riderMarker, setRiderMarker] = useState<any | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<any | null>(null);
  const [storeMarker, setStoreMarker] = useState<any | null>(null);
  const { toast } = useToast();

  // Simulated coordinates for demonstration
  const storeCoords = { lat: 28.6139, lng: 77.2090 }; // Store location
  const destinationCoords = { lat: 28.6239, lng: 77.2290 }; // Delivery destination
  const initialRiderCoords = { lat: 28.6180, lng: 77.2160 }; // Initial rider position

  useEffect(() => {
    // Initialize map when component mounts
    const setupMap = async () => {
      await initializeMap();
      
      if (mapRef.current && window.L) {
        try {
          // Create Leaflet map
          const leafletMap = window.L.map(mapRef.current).setView([initialRiderCoords.lat, initialRiderCoords.lng], 14);
          
          // Add OpenFreeMap tile layer
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          }).addTo(leafletMap);
          
          setMap(leafletMap);
          
          // Store marker (origin)
          const storeIcon = window.L.divIcon({
            html: `<div class="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path></svg>
                  </div>`,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
          
          const store = window.L.marker([storeCoords.lat, storeCoords.lng], { icon: storeIcon }).addTo(leafletMap);
          store.bindTooltip("Store", { permanent: false, direction: 'top' });
          setStoreMarker(store);
          
          // Destination marker
          const destinationIcon = window.L.divIcon({
            html: `<div class="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>`,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
          
          const destination = window.L.marker([destinationCoords.lat, destinationCoords.lng], { icon: destinationIcon }).addTo(leafletMap);
          destination.bindTooltip("Your Location", { permanent: false, direction: 'top' });
          setDestinationMarker(destination);
          
          // Draw route between store and destination
          const routeCoordinates = [
            [storeCoords.lat, storeCoords.lng],
            [initialRiderCoords.lat, initialRiderCoords.lng],
            [destinationCoords.lat, destinationCoords.lng]
          ];
          
          const routePath = window.L.polyline(routeCoordinates, {
            color: '#9b87f5',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineCap: 'round'
          }).addTo(leafletMap);
          
          // Add a moving marker for the rider if showRider is true
          if (showRider) {
            const riderIcon = window.L.divIcon({
              html: `<div class="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full border-2 border-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                    </div>`,
              className: '',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });
            
            const rider = window.L.marker([initialRiderCoords.lat, initialRiderCoords.lng], { icon: riderIcon }).addTo(leafletMap);
            rider.bindTooltip(`${eta} min`, { permanent: false, direction: 'top' });
            setRiderMarker(rider);
            
            // Fit map to show all markers
            const bounds = window.L.latLngBounds([
              [storeCoords.lat, storeCoords.lng],
              [destinationCoords.lat, destinationCoords.lng],
              [initialRiderCoords.lat, initialRiderCoords.lng]
            ]);
            leafletMap.fitBounds(bounds, { padding: [30, 30] });
            
            // Start animation
            startRiderAnimation();
          } else {
            // Just fit the map to store and destination
            const bounds = window.L.latLngBounds([
              [storeCoords.lat, storeCoords.lng],
              [destinationCoords.lat, destinationCoords.lng]
            ]);
            leafletMap.fitBounds(bounds, { padding: [30, 30] });
          }
        } catch (error) {
          console.error("Error initializing map:", error);
          renderFallbackMap();
        }
      } else {
        console.error("Leaflet not available or map container not found");
        renderFallbackMap();
      }
    };
    
    setupMap();
    
    return () => {
      // Clean up map on component unmount
      if (map) {
        map.remove();
      }
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
    if (!riderMarker || animating) return;
    
    setAnimating(true);
    
    // Define waypoints for the rider to travel (from store to destination)
    const waypoints = [
      [initialRiderCoords.lat, initialRiderCoords.lng],
      [initialRiderCoords.lat + 0.001, initialRiderCoords.lng + 0.002],
      [initialRiderCoords.lat + 0.003, initialRiderCoords.lng + 0.003],
      [initialRiderCoords.lat + 0.005, initialRiderCoords.lng + 0.0025],
      [destinationCoords.lat - 0.002, destinationCoords.lng - 0.001],
      [destinationCoords.lat, destinationCoords.lng]
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
        riderMarker.setLatLng(waypoints[waypoints.length - 1]);
        return;
      }
      
      // Interpolate position between waypoints
      const segmentElapsedTime = elapsedTime % waypointInterval;
      const segmentProgress = segmentElapsedTime / waypointInterval;
      
      const startPoint = waypoints[currentSegment];
      const endPoint = waypoints[currentSegment + 1];
      
      const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress;
      const lng = startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress;
      
      riderMarker.setLatLng([lat, lng]);
      
      // Update ETA tooltip
      if (riderMarker.getTooltip()) {
        riderMarker.setTooltipContent(`${eta} min`);
      }
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
