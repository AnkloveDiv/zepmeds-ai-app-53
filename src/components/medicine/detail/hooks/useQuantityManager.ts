
import { useState, useEffect } from 'react';
import { MedicineType } from '../utils/detectMedicineType';

export const useQuantityManager = (medicineType: MedicineType, unitsPerStrip = 10) => {
  const [quantity, setQuantity] = useState(1);
  const [strips, setStrips] = useState(1);
  const [totalUnits, setTotalUnits] = useState(0);

  // Calculate total units
  useEffect(() => {
    if (medicineType === "tablets") {
      setTotalUnits(quantity + (strips * unitsPerStrip));
    } else {
      setTotalUnits(quantity);
    }
  }, [quantity, strips, medicineType, unitsPerStrip]);

  const handleDecrement = (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => {
    if (current > 1) {
      setter(current - 1);
    }
  };

  const handleIncrement = (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => {
    setter(current + 1);
  };

  return {
    quantity,
    setQuantity,
    strips,
    setStrips,
    totalUnits,
    handleDecrement,
    handleIncrement
  };
};
