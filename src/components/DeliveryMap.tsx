
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon, Stroke } from 'ol/style';
import LineString from 'ol/geom/LineString';
import 'ol/ol.css';

interface DeliveryMapProps {
  showRider?: boolean;
  orderId?: string;
}

const DeliveryMap = ({ showRider = true, orderId }: DeliveryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(2.4);
  const [eta, setEta] = useState(15);
  const [animating, setAnimating] = useState(false);
  const [map, setMap] = useState<Map | null>(null);
  const [layersInitialized, setLayersInitialized] = useState(false);
  const { toast } = useToast();

  // Simulated coordinates for demonstration
  const storeCoords = [77.2090, 28.6139]; // Store location in [lon, lat] for OpenLayers
  const destinationCoords = [77.2290, 28.6239]; // Delivery destination
  const initialRiderCoords = [77.2160, 28.6180]; // Initial rider position

  useEffect(() => {
    // Initialize map when component mounts
    if (!mapRef.current || map) return;
    
    try {
      // Create OpenLayers Map
      const olMap = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: fromLonLat(initialRiderCoords),
          zoom: 14,
          maxZoom: 19
        }),
        controls: []
      });
      
      setMap(olMap);
      
      // Create marker source and layers after map is initialized
      const markerSource = new VectorSource();
      const routeSource = new VectorSource();
      
      // Create style for store marker
      const storeStyle = new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%239b87f5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" fill="%239b87f5" stroke="white"/></svg>',
          scale: 1.5
        })
      });
      
      // Create style for destination marker
      const destStyle = new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23FF4500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" fill="%23FF4500" stroke="white"/></svg>',
          scale: 1.5
        })
      });
      
      // Create style for rider marker
      const riderStyle = new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23FF9500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" fill="%23FF9500" stroke="white"/></svg>',
          scale: 1.5
        })
      });
      
      // Create store feature
      const storeFeature = new Feature({
        geometry: new Point(fromLonLat(storeCoords)),
        name: 'Store'
      });
      storeFeature.setStyle(storeStyle);
      markerSource.addFeature(storeFeature);
      
      // Create destination feature
      const destFeature = new Feature({
        geometry: new Point(fromLonLat(destinationCoords)),
        name: 'Destination'
      });
      destFeature.setStyle(destStyle);
      markerSource.addFeature(destFeature);
      
      // Create route feature
      const routeCoords = [
        fromLonLat(storeCoords),
        fromLonLat(initialRiderCoords),
        fromLonLat(destinationCoords)
      ];
      
      const routeFeature = new Feature({
        geometry: new LineString(routeCoords)
      });
      
      const routeStyle = new Style({
        stroke: new Stroke({
          color: '#9b87f5',
          width: 4,
          lineDash: [8, 8]
        })
      });
      
      routeFeature.setStyle(routeStyle);
      routeSource.addFeature(routeFeature);
      
      // Create route layer
      const routeLayer = new VectorLayer({
        source: routeSource
      });
      
      // Create marker layer
      const markerLayer = new VectorLayer({
        source: markerSource
      });
      
      // Add layers to map
      olMap.addLayer(routeLayer);
      olMap.addLayer(markerLayer);
      
      // If showRider is true, add rider marker
      if (showRider) {
        const riderFeature = new Feature({
          geometry: new Point(fromLonLat(initialRiderCoords)),
          name: 'Rider'
        });
        riderFeature.setStyle(riderStyle);
        markerSource.addFeature(riderFeature);
        
        // Start rider animation
        setTimeout(() => {
          startRiderAnimation(riderFeature, markerSource);
        }, 1000);
      }
      
      setLayersInitialized(true);
      
      // Fit view to show all markers
      const extent = markerSource.getExtent();
      olMap.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 16
      });
      
    } catch (error) {
      console.error("Error initializing map:", error);
      renderFallbackMap();
    }
    
    return () => {
      if (map) {
        map.setTarget(undefined);
      }
    };
  }, [map, showRider]);

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
          ctx.beginPath();
          ctx.roundRect(riderX - 25, riderY - 25, 50, 20, 5);
          ctx.fill();
          
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "12px Arial";
          ctx.fillText(`${eta} min`, riderX - 15, riderY - 12);
        }
      }
    }
  };

  const startRiderAnimation = (riderFeature: Feature, markerSource: VectorSource) => {
    if (animating) return;
    
    setAnimating(true);
    
    // Define waypoints for the rider to travel (from store to destination)
    const waypoints = [
      initialRiderCoords,
      [initialRiderCoords[0] + 0.002, initialRiderCoords[1] + 0.001],
      [initialRiderCoords[0] + 0.003, initialRiderCoords[1] + 0.003],
      [initialRiderCoords[0] + 0.0025, initialRiderCoords[1] + 0.005],
      [destinationCoords[0] - 0.001, destinationCoords[1] - 0.002],
      destinationCoords
    ];
    
    let currentWaypoint = 0;
    const totalTime = 60000; // 60 seconds for full animation
    const waypointInterval = totalTime / (waypoints.length - 1);
    const startTime = Date.now();
    
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
        const finalPoint = fromLonLat(waypoints[waypoints.length - 1]);
        
        if (riderFeature) {
          riderFeature.setGeometry(new Point(finalPoint));
          markerSource.changed();
        }
        
        setAnimating(false);
        return;
      }
      
      // Interpolate position between waypoints
      const segmentElapsedTime = elapsedTime % waypointInterval;
      const segmentProgress = segmentElapsedTime / waypointInterval;
      
      const startPoint = waypoints[currentSegment];
      const endPoint = waypoints[currentSegment + 1];
      
      const lon = startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress;
      const lat = startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress;
      
      if (riderFeature) {
        riderFeature.setGeometry(new Point(fromLonLat([lon, lat])));
        markerSource.changed();
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
