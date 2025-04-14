
import { GEMINI_API_KEY, GEMINI_API_URL } from './constants';
import { TextDetectionResult } from './types';
import { extractMedicineNamesFromText } from './textExtraction';

/**
 * Process image directly with Gemini API
 * This is a fallback when Vision API fails
 */
export const processImageWithGemini = async (imageBase64: string): Promise<TextDetectionResult> => {
  try {
    console.log("Attempting direct image processing with Gemini API as fallback");
    
    // Enhanced prompt for better medicine extraction
    const prompt = `
      You are an OCR expert trained to extract text from images of medical prescriptions with 99.9% accuracy.
      
      First, extract ALL text from this image character by character, paying extremely close attention to:
      1. Medication names with their exact spelling
      2. Dosage information
      3. Doctor information
      4. Patient information
      5. Instructions
      
      After extracting the text, determine:
      1. Is this definitely a prescription (with high confidence)?
      2. What medications are mentioned? Be extremely accurate with medication names, include the exact spelling, dosage, and anything else mentioned about each medication.
      
      The output must be a JSON object with this structure:
      {
        "extractedText": "full text extracted from image, line by line",
        "isPrescription": true/false,
        "medicineNames": ["Medicine1 dosage", "Medicine2 dosage"],
        "confidence": 0.X
      }
      
      IMPORTANT NOTES:
      - If the image contains "Amoxicillin" or similar medicines, capture that exactly
      - If it contains "Voglibet GM 2" or similar medications, capture those exactly
      - Do not guess medication names if they are not clearly visible - only list actual medicine names you see
      - If no medications are found, return an empty array
      - If you're not sure about a medication name, include it with whatever text you can read
      - Include the confidence score for your analysis (0.0 to 1.0)
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: "image/jpeg"
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      
      // Return a clear error message if the API fails
      return {
        text: "Unable to analyze the image. Our AI services are currently unavailable. Please try again later.",
        isPrescription: false,
        medicineNames: [],
        confidence: 0
      };
    }

    const data = await response.json();
    console.log("Gemini API response received");
    
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Empty response from Gemini API");
    }
    
    console.log("Raw Gemini response:", textResponse);
    
    // Extract JSON from response
    const jsonStartIndex = textResponse.indexOf('{');
    const jsonEndIndex = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("Could not find JSON in Gemini response");
    }
    
    const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);
    console.log("Extracted JSON string:", jsonString);
    
    let parsedResult;
    
    try {
      parsedResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini response:", parseError);
      console.log("Trying to fix malformed JSON");
      
      // Try to clean up and fix common JSON issues
      const cleanedJson = jsonString
        .replace(/\n/g, ' ')
        .replace(/\\"/g, '"')
        .replace(/"/g, '"')
        .replace(/"/g, '"')
        .replace(/'/g, "'")
        .replace(/'/g, "'");
      
      try {
        parsedResult = JSON.parse(cleanedJson);
      } catch (secondError) {
        console.error("Still could not parse JSON:", secondError);
        
        // If we can't parse the JSON, extract the medicine names directly from text
        const medicineNames = extractMedicineNamesFromText(textResponse);
        
        return {
          text: textResponse,
          isPrescription: textResponse.toLowerCase().includes("prescription") || 
                         textResponse.toLowerCase().includes("rx") ||
                         textResponse.toLowerCase().includes("doctor"),
          medicineNames,
          confidence: 0.5
        };
      }
    }
    
    return {
      text: parsedResult.extractedText || "",
      isPrescription: parsedResult.isPrescription || false,
      medicineNames: parsedResult.medicineNames || [],
      confidence: parsedResult.confidence || 0.5
    };
  } catch (error) {
    console.error("Error in Gemini processing:", error);
    
    // Return proper error result
    return {
      text: "Failed to process image with AI vision technology.",
      isPrescription: false,
      medicineNames: [],
      confidence: 0
    };
  }
};
