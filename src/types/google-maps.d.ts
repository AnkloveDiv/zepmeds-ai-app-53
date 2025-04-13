
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
      fitBounds(bounds: LatLngBounds, padding?: number | Padding): void;
      data?: Data; // Add data property to Map class
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng | null;
      setMap(map: Map | null): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
      setAnimation(animation: any): void;
      setIcon(icon: string | Icon | Symbol): void;
      getIcon(): string | Icon | Symbol | undefined;
      getTitle(): string | undefined;
    }

    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      isEmpty(): boolean;
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
      toJSON(): object;
    }

    interface Padding {
      top: number;
      right: number;
      bottom: number;
      left: number;
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
      gestureHandling?: string;
      restriction?: MapRestriction;
    }

    interface MapRestriction {
      latLngBounds: LatLngBounds | LatLngBoundsLiteral;
      strictBounds?: boolean;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      draggable?: boolean;
      animation?: any;
      label?: string | MarkerLabel;
      clickable?: boolean;
      cursor?: string;
    }

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      toJSON(): LatLngLiteral;
      toString(): string;
      equals(other: LatLng): boolean;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      bounds?: LatLngBounds | LatLngBoundsLiteral;
      componentRestrictions?: GeocoderComponentRestrictions;
      region?: string;
    }

    interface GeocoderComponentRestrictions {
      country: string | string[];
      administrativeArea?: string;
      locality?: string;
      postalCode?: string;
      route?: string;
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
        location_type?: string;
        bounds?: LatLngBounds;
        viewport?: LatLngBounds;
      };
      place_id: string;
      plus_code?: {
        compound_code: string;
        global_code: string;
      };
      types?: string[];
      partial_match?: boolean;
    }

    type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';

    class MapsEventListener {
      remove(): void;
    }

    interface Icon {
      url: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
      labelOrigin?: Point;
      path?: string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
    }

    interface Symbol {
      path: string | number;
      scale: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
      rotation?: number;
    }

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      width: number;
      height: number;
      equals(other: Size): boolean;
      toString(): string;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      equals(other: Point): boolean;
      toString(): string;
    }

    class Circle {
      constructor(opts?: CircleOptions);
      setCenter(center: LatLng | LatLngLiteral): void;
      setRadius(radius: number): void;
      setMap(map: Map | null): void;
      getCenter(): LatLng;
      getRadius(): number;
    }

    interface CircleOptions {
      center?: LatLng | LatLngLiteral;
      radius?: number;
      map?: Map;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      fillColor?: string;
      fillOpacity?: number;
      clickable?: boolean;
      draggable?: boolean;
      editable?: boolean;
      visible?: boolean;
      zIndex?: number;
    }

    class Polyline {
      constructor(opts?: PolylineOptions);
      setPath(path: Array<LatLng | LatLngLiteral>): void;
      setMap(map: Map | null): void;
      getPath(): MVCArray<LatLng>;
    }

    interface PolylineOptions {
      path?: Array<LatLng | LatLngLiteral> | MVCArray<LatLng>;
      map?: Map;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      geodesic?: boolean;
      clickable?: boolean;
      draggable?: boolean;
      editable?: boolean;
      visible?: boolean;
      zIndex?: number;
      icons?: Array<IconSequence>;
    }

    interface IconSequence {
      icon: Symbol;
      offset?: string;
      repeat?: string;
    }

    class MVCArray<T> {
      constructor(array?: T[]);
      clear(): void;
      forEach(callback: (elem: T, i: number) => void): void;
      getArray(): T[];
      getAt(i: number): T;
      getLength(): number;
      insertAt(i: number, elem: T): void;
      pop(): T;
      push(elem: T): number;
      removeAt(i: number): T;
      setAt(i: number, elem: T): void;
    }

    // Add Data class definition for the data layer in Google Maps
    class Data {
      constructor(options?: DataOptions);
      add(feature: Feature | FeatureOptions): Feature;
      addGeoJson(geoJson: Object, options?: GeoJsonOptions): Feature[];
      contains(feature: Feature): boolean;
      forEach(callback: (feature: Feature) => void): void;
      getControlPosition(): number;
      getControls(): number[];
      getDrawingMode(): string;
      getFeatureById(id: string | number): Feature | null;
      getMap(): Map;
      getStyle(): Data.StylingFunction | Data.StyleOptions;
      loadGeoJson(url: string, options?: GeoJsonOptions, callback?: (features: Feature[]) => void): void;
      overrideStyle(feature: Feature, style: Data.StyleOptions): void;
      remove(feature: Feature): void;
      revertStyle(feature?: Feature): void;
      setControlPosition(controlPosition: number): void;
      setControls(controls: string[]): void;
      setDrawingMode(drawingMode: string): void;
      setMap(map: Map | null): void;
      setStyle(style: Data.StylingFunction | Data.StyleOptions): void;
      toGeoJson(callback: (obj: Object) => void): void;
    }

    namespace Data {
      interface StylingFunction {
        (feature: Feature): StyleOptions;
      }

      interface StyleOptions {
        clickable?: boolean;
        cursor?: string;
        draggable?: boolean;
        editable?: boolean;
        fillColor?: string;
        fillOpacity?: number;
        icon?: string | Icon | Symbol;
        shape?: MarkerShape;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
        title?: string;
        visible?: boolean;
        zIndex?: number;
      }
    }

    interface DataOptions {
      controlPosition?: number;
      controls?: string[];
      drawingMode?: string;
      featureFactory?: (geometry: Data.Geometry) => Feature;
      map?: Map;
      style?: Data.StylingFunction | Data.StyleOptions;
    }

    interface GeoJsonOptions {
      idPropertyName?: string;
    }

    interface FeatureOptions {
      geometry?: Data.Geometry | Data.GeometryOptions;
      id?: string | number;
      properties?: Object;
    }

    class Feature {
      constructor(options?: FeatureOptions);
      forEachProperty(callback: (value: any, name: string) => void): void;
      getGeometry(): Data.Geometry;
      getId(): string | number;
      getProperty(name: string): any;
      removeProperty(name: string): void;
      setGeometry(newGeometry: Data.Geometry | Data.GeometryOptions | LatLng | LatLngLiteral): void;
      setProperty(name: string, newValue: any): void;
      toGeoJson(callback: (obj: Object) => void): void;
    }

    namespace Data {
      interface GeometryOptions {
        type: string;
        coordinates: any;
      }

      class Geometry {
        getType(): string;
        forEachLatLng(callback: (latLng: LatLng) => void): void;
      }
    }

    interface MarkerShape {
      coords: number[];
      type: string;
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
      domEvent: Event;
      stop(): void;
    }
    
    // Add MapTypeId enum
    const MapTypeId: {
      ROADMAP: string;
      SATELLITE: string;
      HYBRID: string;
      TERRAIN: string;
    };
  }
}
