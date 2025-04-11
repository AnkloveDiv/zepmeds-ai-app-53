
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface DeliveryMapProps {
  showRider?: boolean;
  orderId?: string;
}

const DeliveryMap = ({ showRider = true, orderId }: DeliveryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(2.4);
  const [eta, setEta] = useState(15);
  const [animating, setAnimating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This is a placeholder for a real map integration
    // In a production app, you would integrate with Google Maps or Mapbox here
    if (mapRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = mapRef.current.clientWidth;
      canvas.height = mapRef.current.clientHeight;
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
    
    // Animation for decreasing distance and ETA
    if (showRider && !animating) {
      setAnimating(true);
      const distanceInterval = setInterval(() => {
        setDistance(prevDistance => {
          const newDistance = prevDistance - 0.1;
          return newDistance > 0.1 ? newDistance : 0.1;
        });
        
        setEta(prevEta => {
          const newEta = prevEta - 1;
          return newEta > 1 ? newEta : 1;
        });
      }, 10000); // Update every 10 seconds
      
      return () => clearInterval(distanceInterval);
    }
  }, [distance, eta, animating, showRider]);

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
