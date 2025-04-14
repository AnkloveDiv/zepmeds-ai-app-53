
import { GEMINI_API_KEY, GEMINI_API_URL } from './constants';
import { TextDetectionResult } from './types';
import { extractMedicineNamesFromText } from './textExtraction';

/**
 * Use Gemini API to analyze prescription text
 * @param text - Extracted text from the image
 */
export const analyzePrescriptionText = async (text: string): Promise<TextDetectionResult> => {
  try {
    // Enhanced prescription detection prompt with accuracy focus
    const prompt = `
      You are a medical assistant AI specifically trained to identify medical prescriptions and extract medication information with 99.9% accuracy.
      
      Analyze the following text extracted from an image and determine:
      
      1. Is this text DEFINITELY from a medical prescription? Be STRICT in your assessment.
      Only return true if the text contains elements typical of prescriptions, like:
         - Doctor's name or signature
         - Patient information
         - Clearly identifiable medication names with dosages
         - Instructions for taking medication
      
      2. Extract all medicine names with their dosage with extreme accuracy. Be very precise with medication names like:
         - Amoxicillin 500mg
         - Voglibet GM 2
         - Any other medications you find
      
      3. Provide a confidence score (0.0 to 1.0) indicating how certain you are that this is a prescription.
      
      Text from image: "${text}"
      
      Format your response STRICTLY as a valid JSON object with the following structure:
      {
        "isPrescription": true/false,
        "medicineNames": ["Medicine1 dosage", "Medicine2 dosage"],
        "confidence": 0.X
      }
      
      CRITICAL INSTRUCTIONS:
      - If this is clearly NOT a prescription but contains medicine names, set isPrescription to false, but still extract medicine names accurately.
      - If NO medicines are found at all, return an empty array for medicineNames.
      - Include exactly what you see in the text, don't invent medicine names that aren't there.
      - Pay special attention to exact spelling of medicine names.
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
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent results
          topP: 0.8,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error("Empty response from Gemini API");
    }
    
    console.log("Raw analysis response:", textResponse);
    
    // Extract JSON from the response
    const jsonStartIndex = textResponse.indexOf('{');
    const jsonEndIndex = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      // If JSON extraction fails, try to extract medicine names directly from text
      const medicineNames = await extractMedicineNames(text);
      
      return {
        text,
        isPrescription: false,
        medicineNames,
        confidence: 0.5
      };
    }
    
    const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);
    console.log("Analysis JSON:", jsonString);
    
    try {
      const analysisResult = JSON.parse(jsonString);
      
      // Return the result with text included
      return {
        text,
        isPrescription: analysisResult.isPrescription,
        medicineNames: analysisResult.medicineNames || [],
        confidence: analysisResult.confidence || 0
      };
    } catch (jsonError) {
      console.error("Error parsing analysis JSON:", jsonError);
      
      // Try to extract medicine names as last resort
      const medicineNames = await extractMedicineNames(text);
      
      return {
        text,
        isPrescription: false,
        medicineNames,
        confidence: 0.5
      };
    }
  } catch (error) {
    console.error("Error analyzing prescription text:", error);
    
    // Try to extract medicine names as last resort
    try {
      const medicineNames = await extractMedicineNames(text);
      
      // Return result with extracted medicine names
      return {
        text,
        isPrescription: false,
        medicineNames, 
        confidence: 0.6
      };
    } catch (extractError) {
      console.error("Failed to extract medicine names:", extractError);
      return {
        text,
        isPrescription: false,
        medicineNames: [],
        confidence: 0
      };
    }
  }
};

/**
 * Extract medicine names from text even if it's not a formal prescription
 * @param text - Extracted text from the image
 */
export const extractMedicineNames = async (text: string): Promise<string[]> => {
  try {
    const prompt = `
      You are a medical assistant AI that specializes in identifying medication names with 99.9% accuracy.
      
      Extract ALL possible medication names from the following text, even if it doesn't look like a formal prescription.
      Look for any words that could represent medications, including generic and brand names.
      Include dosage information if available.
      
      Text: "${text}"
      
      Format your response STRICTLY as a valid JSON array of strings, each containing a medicine name with dosage when available:
      ["Medicine1 dosage", "Medicine2 dosage", "Medicine3"]
      
      CRITICAL INSTRUCTIONS:
      - Include EXACTLY what you see in the text, don't invent medicine names
      - Pay special attention to medicines like "Amoxicillin 500mg" or "Voglibet GM 2" if they appear
      - If absolutely NO medicine names can be found in the text, return an empty array: []
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
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error("Empty response from Gemini API");
    }
    
    console.log("Medicine extraction raw response:", textResponse);
    
    // Extract JSON from the response
    const jsonStartIndex = textResponse.indexOf('[');
    const jsonEndIndex = textResponse.lastIndexOf(']') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      console.error("Could not find JSON in medicine extraction response");
      
      // Fallback to regex pattern matching
      return extractMedicineNamesFromText(text);
    }
    
    const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);
    console.log("Medicine extraction JSON:", jsonString);
    
    try {
      const medicines = JSON.parse(jsonString);
      return Array.isArray(medicines) ? medicines : [];
    } catch (parseError) {
      console.error("Error parsing medicine JSON:", parseError);
      
      // Fallback to regex pattern matching
      return extractMedicineNamesFromText(text);
    }
  } catch (error) {
    console.error("Error extracting medicine names:", error);
    
    // Fallback to regex pattern matching
    return extractMedicineNamesFromText(text);
  }
};
