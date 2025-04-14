
export type MedicineType = "tablets" | "liquid" | "device";

export const detectMedicineType = (medicineName: string): MedicineType => {
  const lowerName = medicineName.toLowerCase();
  
  if (lowerName.includes("solution") || 
      lowerName.includes("gel") || 
      lowerName.includes("drops") ||
      lowerName.includes("cream") ||
      lowerName.includes("syrup") ||
      lowerName.includes("liquid") ||
      lowerName.includes("lotion")) {
    return "liquid";
  } else if (lowerName.includes("monitor") || 
            lowerName.includes("thermometer") ||
            lowerName.includes("device") ||
            lowerName.includes("machine") ||
            lowerName.includes("meter") ||
            lowerName.includes("tester") ||
            lowerName.includes("glasses")) {
    return "device";
  } else {
    return "tablets";
  }
};
