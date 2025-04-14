
import { useState } from "react";
import { useQuantityManager } from "./useQuantityManager";
import { detectMedicineType } from "../utils/detectMedicineType";

export const useMedicineQuantity = (medicineName: string) => {
  const medicineType = detectMedicineType(medicineName);
  const isLiquid = medicineType === "liquid";
  const [animateQuantity, setAnimateQuantity] = useState(false);
  
  const {
    quantity,
    setQuantity,
    strips,
    setStrips,
    handleDecrement,
    handleIncrement
  } = useQuantityManager(medicineType);

  const handleIncrementQuantity = (e: React.MouseEvent) => {
    handleIncrement(setQuantity, quantity);
    triggerAnimation();
  };

  const handleDecrementQuantity = (e: React.MouseEvent) => {
    if (quantity > 1) {
      handleDecrement(setQuantity, quantity);
      triggerAnimation();
    }
  };

  const handleIncrementStrips = (e: React.MouseEvent) => {
    handleIncrement(setStrips, strips);
  };

  const handleDecrementStrips = (e: React.MouseEvent) => {
    if (strips > 1) {
      handleDecrement(setStrips, strips);
    }
  };

  const triggerAnimation = () => {
    setAnimateQuantity(true);
    setTimeout(() => setAnimateQuantity(false), 300);
  };

  return {
    quantity,
    strips,
    isLiquid,
    animateQuantity,
    handleIncrementQuantity,
    handleDecrementQuantity,
    handleIncrementStrips,
    handleDecrementStrips,
    triggerAnimation
  };
};
