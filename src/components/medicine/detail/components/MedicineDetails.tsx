
import React from "react";

interface MedicineDetailsProps {
  name: string;
  description?: string;
  rating: number;
  price: number;
  discountPrice?: number;
  manufacturer?: string;
  expiryDate?: string;
}

const MedicineDetails: React.FC<MedicineDetailsProps> = ({ 
  name, 
  description, 
  rating, 
  price, 
  discountPrice, 
  manufacturer, 
  expiryDate 
}) => {
  return (
    <>
      {/* Medicine Details Section */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          
          <div className="flex items-center bg-amber-500/20 px-2 py-1 rounded-full">
            <span className="text-amber-400 mr-1">★</span>
            <span className="text-white text-sm">{rating}</span>
          </div>
        </div>
        
        {/* Price Information */}
        <div className="flex items-baseline mt-2">
          {discountPrice ? (
            <>
              <span className="text-blue-400 text-xl font-bold mr-2">₹{discountPrice}</span>
              <span className="text-gray-400 text-sm line-through">₹{price}</span>
            </>
          ) : (
            <span className="text-blue-400 text-xl font-bold">₹{price}</span>
          )}
        </div>
      </div>
      
      {/* Medicine Information */}
      <div className="px-4 py-2 border-t border-b border-gray-800/50 bg-gray-900/20">
        <div className="grid grid-cols-2 gap-y-3">
          <div className="flex items-center text-sm text-gray-300">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM7 7H9V9H7V7ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM17 17H11V15H17V17ZM17 13H11V11H17V13ZM17 9H11V7H17V9Z" />
              </svg>
            </span>
            {manufacturer || "SclіKort"}
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM12 13H17V18H12V13Z" />
              </svg>
            </span>
            {expiryDate || "Jan 2026"}
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19.5,3.5L18,2L16.5,3.5L15,2L13.5,3.5L12,2L10.5,3.5L9,2L7.5,3.5L6,2V16H3V19C3,20.66 4.34,22 6,22H18C19.66,22 21,20.66 21,19V2L19.5,3.5M19,19C19,19.55 18.55,20 18,20H6C5.45,20 5,19.55 5,19V16H19V19M19,14H6V4.08L7.5,5.58L9,4.08L10.5,5.58L12,4.08L13.5,5.58L15,4.08L16.5,5.58L18,4.08L19,5.08V14Z" />
              </svg>
            </span>
            Free Delivery
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z" />
              </svg>
            </span>
            100% Genuine
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineDetails;
