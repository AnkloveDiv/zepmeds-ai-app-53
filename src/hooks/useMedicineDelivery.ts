
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { TrendingProduct } from '@/types/productTypes';
import { fetchWeatherByCoordinates, WeatherData } from '@/services/weatherService';
import { reverseGeocode } from '@/utils/openLayersLoader';
import { allProducts } from '@/data/medicineData';

export const useMedicineDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  return {
    cartItemsCount,
    activeCategory,
    selectedMedicine,
    isModalOpen,
    products,
    deliveryAddress,
    weatherData,
    handleCartClick,
    handleBackClick,
    handleUploadClick,
    handleCategoryClick,
    handleProductClick,
    handleAddToCart,
    handleModalAddToCart,
    setIsModalOpen
  };
};
