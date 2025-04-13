import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { Button } from "../components/ui/button";
import { Upload, ArrowLeft } from 'lucide-react';
import { useToast } from "../components/ui/use-toast";
import CategoriesNav from '../components/medicine/CategoriesNav';
import ProductGrid from '../components/medicine/ProductGrid';
import FloatingCartButton from '../components/medicine/FloatingCartButton';
import AddressWithWeather from '../components/medicine/AddressWithWeather';
import WeatherAnimation from '../components/medicine/WeatherAnimation';
import MedicineDetailModal from '../components/MedicineDetailModal';
import { useNavigate } from 'react-router-dom';
import { useTrendingProducts, TrendingProduct } from '../hooks/useTrendingProducts';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { fetchWeatherByCoordinates, WeatherData } from '../services/weatherService';
import { allProducts } from '../data/medicineData';
import { 
  loadGoogleMapsAPI, 
  reverseGeocode as getAddressFromCoordinates 
} from '@/utils/googleMapsLoader';

const MedicineDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { ExitConfirmDialog } = useBackNavigation('/dashboard');
  
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMedicine, setSelectedMedicine] = useState<TrendingProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [products, setProducts] = useState(allProducts);
  
  const [deliveryAddress, setDeliveryAddress] = useState("to Home Ghh, Bnn, Gurugram, 122001");
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<{lat: number, lng: number} | null>(null);
  
  const [weatherData, setWeatherData] = useState<WeatherData>({
    condition: 'cloudy',
    temperature: '29°',
    description: 'Cloudy'
  });
  
  useEffect(() => {
    const getCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemsCount(cart.length);
    };
    
    getCartCount();
    
    window.addEventListener('storage', getCartCount);
    
    const savedAddresses = localStorage.getItem("savedAddresses");
    let selectedCoordinates = {lat: 28.4595, lng: 77.0266};
    
    if (savedAddresses) {
      const addresses = JSON.parse(savedAddresses);
      const selectedAddress = addresses.find((addr: any) => addr.isSelected);
      if (selectedAddress) {
        setDeliveryAddress(`to ${selectedAddress.label} ${selectedAddress.address}`);
        
        if (selectedAddress.latitude && selectedAddress.longitude) {
          selectedCoordinates = {
            lat: selectedAddress.latitude,
            lng: selectedAddress.longitude
          };
          setDeliveryCoordinates(selectedCoordinates);
        }
      }
    }
    
    const fetchWeather = async () => {
      try {
        const weather = await fetchWeatherByCoordinates(
          selectedCoordinates.lat, 
          selectedCoordinates.lng
        );
        setWeatherData(weather);
        console.log("Weather data:", weather);
      } catch (error) {
        console.error("Error fetching weather:", error);
        toast({
          title: "Weather Error",
          description: "Could not load weather data. Using default values.",
          variant: "destructive",
        });
      }
    };
    
    fetchWeather();
    
    return () => {
      window.removeEventListener('storage', getCartCount);
    };
  }, [toast]);
  
  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleUploadClick = () => {
    toast({
      title: "Prescription Upload",
      description: "Our AI will analyze your prescription and suggest medicines.",
      duration: 3000,
    });
    navigate('/prescription-upload');
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    toast({
      title: `${category} selected`,
      description: `Showing medicines in the ${category} category.`,
      duration: 2000,
    });
  };

  const handleProductClick = (product: TrendingProduct) => {
    setSelectedMedicine(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: TrendingProduct, quantity = 1) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        ...product,
        quantity: quantity,
        stripQuantity: 1
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCartItemsCount(existingCart.length);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleModalAddToCart = (quantity: number, strips: number) => {
    if (selectedMedicine) {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      const existingItemIndex = existingCart.findIndex((item: any) => item.id === selectedMedicine.id);
      
      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity += quantity;
        existingCart[existingItemIndex].stripQuantity = strips;
      } else {
        existingCart.push({
          ...selectedMedicine,
          quantity: quantity,
          stripQuantity: strips
        });
      }
      
      localStorage.setItem("cart", JSON.stringify(existingCart));
      setCartItemsCount(existingCart.length);
      
      toast({
        title: "Added to cart",
        description: `${selectedMedicine.name} has been added to your cart.`,
        duration: 2000,
      });
      
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black relative">
      <WeatherAnimation type={weatherData.condition} />
      
      <AddressWithWeather 
        deliveryTime="11 minutes delivery"
        address={deliveryAddress}
        weatherTemperature={weatherData.temperature}
        weatherDescription={weatherData.description}
        onBackClick={handleBackClick}
      />
      
      <div className="px-4 py-5 bg-gradient-to-b from-[#3d4355] to-black z-10">
        <SearchBar placeholder="Search for medicines.." />
        
        <div className="mt-4 p-4 bg-[#1a1a1a] rounded-xl flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="8" r="1" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Add prescription and our</p>
              <p className="text-white text-sm font-medium">pharmacist will assist you!</p>
            </div>
          </div>
          <Button 
            variant="default" 
            className="bg-[#3b5cf5] hover:bg-blue-600 text-white px-6"
            onClick={handleUploadClick}
          >
            Upload
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-black px-4 pt-6 pb-20">
        <h2 className="text-white text-2xl font-bold mb-4">Categories</h2>
        <CategoriesNav 
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
        
        <div className="mt-6">
          <h2 className="text-white text-xl font-bold mb-2">
            {activeCategory === "All" ? "Featured Medicines" : `${activeCategory}`}
          </h2>
          <ProductGrid 
            products={products} 
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            filteredCategory={activeCategory}
          />
        </div>
      </div>

      <MedicineDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medicine={selectedMedicine}
        onAddToCart={handleModalAddToCart}
      />

      <FloatingCartButton itemsCount={cartItemsCount} onClick={handleCartClick} />
      
      <ExitConfirmDialog />
    </div>
  );
};

export default MedicineDelivery;
