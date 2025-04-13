
export interface Medicine {
  id: number;
  name: string;
  category: string;
}

export const mockMedicines: Medicine[] = [
  { id: 1, name: "Paracetamol 500mg", category: "Pain Relief" },
  { id: 2, name: "Vitamin C 1000mg", category: "Vitamins" },
  { id: 3, name: "Aspirin 300mg", category: "Pain Relief" },
  { id: 4, name: "Amoxicillin 500mg", category: "Antibiotics" },
  { id: 5, name: "Pantoprazole 40mg", category: "Digestive Health" },
  { id: 6, name: "Face Mask N95", category: "Medical Supplies" },
  { id: 7, name: "Hand Sanitizer", category: "Hygiene" },
  { id: 8, name: "Blood Pressure Monitor", category: "Medical Devices" }
];
