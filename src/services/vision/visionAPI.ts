
import { VISION_API_URL } from './constants';
import { TextDetectionResult } from './types';
import { generateJWT } from './authentication';
import { analyzePrescriptionText } from './textAnalysis';
import { processImageWithGemini } from './geminiProcessing';

/**
 * Detect text from an image using Google Cloud Vision API
 * @param imageBase64 - Base64 encoded image without the prefix
 */
export const detectTextFromVisionAPI = async (imageBase64: string): Promise<TextDetectionResult> => {
  try {
    console.log("Starting text detection from image with Vision API");
    
    // Prepare the Vision API request body
    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64
          },
          features: [
            {
              type: "TEXT_DETECTION",
              maxResults: 50
            },
            {
              type: "DOCUMENT_TEXT_DETECTION",
              maxResults: 50
            }
          ],
          imageContext: {
            languageHints: ["en"]
          }
        }
      ]
    };

    console.log("Making Vision API request with service account authentication");
    
    // Generate authentication for service account
    const authData = await generateJWT();
    
    // If we couldn't generate JWT, try without authentication (fallback)
    if (!authData) {
      console.error("Failed to generate authentication, using fallback method");
      return await processImageWithGemini(imageBase64);
    }
    
    // Call the Vision API
    const response = await fetch(`${VISION_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-user-project": "prescription-ocr-456618",
        "Authorization": `Bearer ${authData.token}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log("Vision API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vision API Error:", errorText);
      
      // Try with Gemini as backup when Vision API fails
      console.log("Vision API authentication failed, using Gemini API for image processing instead");
      return await processImageWithGemini(imageBase64);
    }

    const data = await response.json();
    console.log("Vision API response retrieved successfully");

    if (!data.responses || !data.responses[0] || !data.responses[0].textAnnotations || data.responses[0].textAnnotations.length === 0) {
      console.error("No text detected in the image by Vision API");
      
      // Try with Gemini as backup when no text is detected
      return await processImageWithGemini(imageBase64);
    }

    // Get the full text from the first annotation
    const extractedText = data.responses[0].textAnnotations[0].description;
    console.log("Extracted text from Vision API:", extractedText);

    // Use Gemini API to analyze the text and identify if it's a prescription
    const analysisResult = await analyzePrescriptionText(extractedText);
    
    return analysisResult;
  } catch (error) {
    console.error("Error with Vision API:", error);
    // If Vision API fails completely, fall back to Gemini API
    return await processImageWithGemini(imageBase64);
  }
}
