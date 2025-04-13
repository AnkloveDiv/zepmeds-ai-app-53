
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { Button } from "../components/ui/button";
import { Upload } from 'lucide-react';
import CategoriesNav from '../components/medicine/CategoriesNav';
import ProductGrid from '../components/medicine/ProductGrid';
import FloatingCartButton from '../components/medicine/FloatingCartButton';
import AddressWithWeather from '../components/medicine/AddressWithWeather';
import WeatherAnimation from '../components/medicine/WeatherAnimation';
import LocationWeather from '../components/medicine/LocationWeather';
import { useNavigate } from 'react-router-dom';

const MedicineDelivery = () => {
  // Mock weather condition - in a real app, this would come from an API
  const weatherCondition: 'sunny' | 'rainy' | 'cloudy' = 'cloudy';
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  // Get cart items count from localStorage on component mount
  useEffect(() => {
    const getCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemsCount(cart.length);
    };
    
    getCartCount();
    
    // Add event listener for storage changes (if cart is modified in another tab)
    window.addEventListener('storage', getCartCount);
    
    return () => {
      window.removeEventListener('storage', getCartCount);
    };
  }, []);
  
  // Handle cart button click
  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black relative">
      <WeatherAnimation type={weatherCondition} />
      
      {/* Address Bar with Weather */}
      <AddressWithWeather />
      
      {/* Search Section */}
      <div className="px-4 py-5 bg-gradient-to-b from-[#58684a] to-black z-10">
        <SearchBar placeholder="Search &quot;Multi-Vitamin&quot;" />
        
        {/* Upload Prescription */}
        <div className="mt-4 p-4 bg-[#1a1a1a] rounded-xl flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="8" r="1" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-base font-medium">Add prescription and our</p>
              <p className="text-white text-base font-medium">pharmacist will assist you!</p>
            </div>
          </div>
          <Button variant="default" className="bg-[#3b5cf5] hover:bg-blue-600 text-white px-6">
            Upload
          </Button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="flex-1 bg-black px-4 pt-6 pb-20">
        <h2 className="text-white text-2xl font-bold mb-4">Categories</h2>
        <CategoriesNav />
      </div>

      {/* Floating Cart Button */}
      <FloatingCartButton itemsCount={cartItemsCount} onClick={handleCartClick} />
    </div>
  );
};

export default MedicineDelivery;
