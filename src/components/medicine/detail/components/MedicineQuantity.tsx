
import React from "react";
import QuantityStepper from "@/components/product/QuantityStepper";
import { detectMedicineType } from "../utils/detectMedicineType";

interface MedicineQuantityProps {
  medicine: {
    name: string;
    price: number;
    discountPrice?: number;
    inStock?: boolean;
  };
  quantity: number;
  strips: number;
  handleIncrementQuantity: (e: React.MouseEvent) => void;
  handleDecrementQuantity: (e: React.MouseEvent) => void;
  handleIncrementStrips: (e: React.MouseEvent) => void;
  handleDecrementStrips: (e: React.MouseEvent) => void;
  handleAddToCart: () => void;
  animateQuantity: boolean;
}

const MedicineQuantity: React.FC<MedicineQuantityProps> = ({
  medicine,
  quantity,
  strips,
  handleIncrementQuantity,
  handleDecrementQuantity,
  handleIncrementStrips,
  handleDecrementStrips,
  handleAddToCart,
  animateQuantity
}) => {
  const medicineType = detectMedicineType(medicine.name);
  const isLiquid = medicineType === "liquid";
  const isDevice = medicineType === "device";
  
  // Default inStock to true if not specified
  const inStock = medicine.inStock !== undefined ? medicine.inStock : true;

  return (
    <div className="px-4 py-4 border-t border-gray-800 bg-gray-900/40">
      <QuantityStepper
        quantity={quantity}
        onIncrement={handleIncrementQuantity}
        onDecrement={handleDecrementQuantity}
        onAddToCart={handleAddToCart}
        animateQuantity={animateQuantity}
        isLiquid={isLiquid}
        isDevice={isDevice}
        strips={strips}
        onIncrementStrips={handleIncrementStrips}
        onDecrementStrips={handleDecrementStrips}
        unitsPerStrip={10}
      />
    </div>
  );
};

export default MedicineQuantity;
