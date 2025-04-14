
import { TextDetectionResult } from './types';

/**
 * Function to generate realistic testing data
 */
export const generateMockResultForTesting = (): TextDetectionResult => {
  return {
    text: "Dr. Jane Smith\nPatient: John Doe\nDate: 12/04/2025\n\nRx:\n1. Amoxicillin 500mg - Take 1 capsule three times daily for 7 days\n2. Voglibet GM 2 - Take 1 tablet before meals\n3. Cetirizine 10mg - Take 1 tablet daily for allergies\n\nRefill: 0\nDr. Smith",
    isPrescription: true,
    medicineNames: ["Amoxicillin 500mg", "Voglibet GM 2", "Cetirizine 10mg"],
    confidence: 0.95
  };
};
