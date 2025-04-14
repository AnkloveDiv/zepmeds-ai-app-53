
import { TextDetectionResult } from './types';
import { generateMockResultForTesting } from './mockData';
import { detectTextFromVisionAPI } from './visionAPI';
import { processImageWithGemini } from './geminiProcessing';

/**
 * Main function to detect text from an image
 * @param imageBase64 - Base64 encoded image without the prefix
 */
export const detectTextFromImage = async (imageBase64: string): Promise<TextDetectionResult> => {
  try {
    console.log("Starting text detection from image with service account authentication");
    
    // For placeholder image in demo, use mock data with high accuracy
    if (imageBase64 === "/placeholder.svg") {
      console.log("Using placeholder image for testing");
      // Wait to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      return await generateMockResultForTesting();
    }
    
    // Try Vision API with service account authentication
    try {
      return await detectTextFromVisionAPI(imageBase64);
    } catch (apiError) {
      console.error("Error with Vision API:", apiError);
      // If Vision API fails completely, fall back to Gemini API
      return await processImageWithGemini(imageBase64);
    }
  } catch (error) {
    console.error("Error in text detection:", error);
    
    // Return empty result with error message
    return {
      text: "Failed to process image. No medicine names could be detected.",
      isPrescription: false,
      medicineNames: [], // Empty list when detection fails
      confidence: 0
    };
  }
};

// Export types and mock functions for testing
export type { TextDetectionResult };
export { generateMockResultForTesting };
