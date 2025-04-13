
// Type definitions for Google Maps JavaScript API
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng | null;
      setMap(map: Map | null): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
      setAnimation(animation: any): void;
    }

    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      mapTypeControl?: boolean;
      fullscreenControl?: boolean;
      streetViewControl?: boolean;
      zoomControl?: boolean;
      styles?: any[];
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      draggable?: boolean;
      animation?: any;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
    }

    interface GeocoderResult {
      address_components: {
        long_name: string;
        short_name: string;
        types: string[];
      }[];
      formatted_address: string;
      geometry: {
        location: LatLng;
      };
      place_id: string;
    }

    type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';

    class MapsEventListener {
      remove(): void;
    }

    interface Icon {
      path: string | any;
      scale: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }

    interface Symbol {
      path: string | any;
      scale: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }

    const Animation: {
      BOUNCE: number;
      DROP: number;
    };

    const SymbolPath: {
      CIRCLE: number;
      FORWARD_CLOSED_ARROW: number;
      FORWARD_OPEN_ARROW: number;
      BACKWARD_CLOSED_ARROW: number;
      BACKWARD_OPEN_ARROW: number;
    };
    
    // Add MouseEvent interface that was missing
    interface MouseEvent {
      latLng: LatLng;
    }
  }
}
