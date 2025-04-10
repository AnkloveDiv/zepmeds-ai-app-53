
import { useState, useEffect } from "react";
import AdvertisementModal from "@/components/medicine/AdvertisementModal";

interface AdvertisementProps {
  advertisements: any[];
  autoShowTimeout?: number;
}

const AdvertisementSection = ({ advertisements, autoShowTimeout = 3000 }: AdvertisementProps) => {
  const [showAdvertisement, setShowAdvertisement] = useState(false);
  const randomAdIndex = Math.floor(Math.random() * advertisements.length);

  useEffect(() => {
    const adTimer = setTimeout(() => {
      setShowAdvertisement(true);
    }, autoShowTimeout);
    
    return () => clearTimeout(adTimer);
  }, [autoShowTimeout]);

  const handleClose = () => {
    setShowAdvertisement(false);
  };

  return (
    <>
      {showAdvertisement && (
        <AdvertisementModal 
          {...advertisements[randomAdIndex]} 
          onClose={handleClose} 
        />
      )}
    </>
  );
};

export default AdvertisementSection;
