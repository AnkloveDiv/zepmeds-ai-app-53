
import { useState } from "react";

interface ProductImageProps {
  image: string;
  name: string;
  onLoad: () => void;
  onError: () => void;
  imageLoaded: boolean;
}

const ProductImage = ({ 
  image, 
  name, 
  onLoad, 
  onError, 
  imageLoaded 
}: ProductImageProps) => {
  return (
    <div className="w-full h-32 bg-gray-800/40 flex items-center justify-center overflow-hidden">
      {!imageLoaded && (
        <div className="animate-pulse w-12 h-12 rounded-full bg-gray-700"></div>
      )}
      <img 
        src={image} 
        alt={name} 
        className={`w-full h-full object-contain p-2 ${!imageLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
};

export default ProductImage;
