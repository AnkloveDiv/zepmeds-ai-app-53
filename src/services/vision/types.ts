
/**
 * Result of text detection from an image
 */
export interface TextDetectionResult {
  text: string;
  isPrescription: boolean;
  medicineNames: string[];
  confidence: number;
}

/**
 * Authentication data for Google Cloud API
 */
export interface AuthData {
  token: string | null;
  clientEmail: string;
  privateKey: string;
}
