
import React from 'react';
import SearchBar from '../components/SearchBar';
import CategoriesNav from '../components/medicine/CategoriesNav';
import ProductGrid from '../components/medicine/ProductGrid';
import FloatingCartButton from '../components/medicine/FloatingCartButton';
import AddressWithWeather from '../components/medicine/AddressWithWeather';
import WeatherAnimation from '../components/medicine/WeatherAnimation';
import MedicineDetailModal from '../components/MedicineDetailModal';
import PrescriptionUploadBanner from '../components/medicine/PrescriptionUploadBanner';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { useMedicineDelivery } from '../hooks/useMedicineDelivery';

const MedicineDelivery = () => {
  const { ExitConfirmDialog } = useBackNavigation('/dashboard');
  
  const {
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
  } = useMedicineDelivery();

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
        
        <PrescriptionUploadBanner onUploadClick={handleUploadClick} />
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
