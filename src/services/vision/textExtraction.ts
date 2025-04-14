
/**
 * Extract medicine names from raw text as a last resort
 */
export const extractMedicineNamesFromText = (text: string): string[] => {
  // Common medicine names patterns
  const medicinePatterns = [
    /\b[A-Z][a-z]+cillin\b\s*\d+\s*mg/gi, // Matches "Amoxicillin 500 mg" etc.
    /\b[A-Z][a-z]+mycin\b\s*\d+\s*mg/gi,  // Matches "Azithromycin 250 mg" etc.
    /\bVoglibet\s*GM\s*\d+\b/gi,          // Matches "Voglibet GM 2" specifically
    /\b[A-Z][a-z]+zole\b\s*\d+\s*mg/gi,   // Matches "Fluconazole 150 mg" etc.
    /\b[A-Z][a-z]+pril\b\s*\d+\s*mg/gi,   // Matches "Lisinopril 10 mg" etc.
    /\b[A-Z][a-z]+sartan\b\s*\d+\s*mg/gi, // Matches "Losartan 50 mg" etc.
    /\b[A-Z][a-z]+statin\b\s*\d+\s*mg/gi, // Matches "Atorvastatin 20 mg" etc.
    /\b[A-Z][a-z]+prazole\b\s*\d+\s*mg/gi // Matches "Omeprazole 20 mg" etc.
  ];
  
  const medicineNames: string[] = [];
  
  // Extract medicines using patterns
  for (const pattern of medicinePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      medicineNames.push(...matches);
    }
  }
  
  // Look for lines that might contain medicine names (simplified)
  const lines = text.split(/[\n\r]/);
  for (const line of lines) {
    // Lines with numbers and mg/mcg are likely medicines
    if (
      (line.includes("mg") || line.includes("mcg") || line.includes("tablet") || line.includes("capsule")) &&
      /\d+/.test(line) && // Contains a number
      !medicineNames.some(med => line.includes(med)) // Not already found
    ) {
      // Extract the likely medicine name + dosage
      const trimmedLine = line.trim();
      if (trimmedLine.length > 5 && trimmedLine.length < 100) { // Reasonable length for a medicine
        medicineNames.push(trimmedLine);
      }
    }
  }
  
  // Return unique medicines
  return [...new Set(medicineNames)];
};
