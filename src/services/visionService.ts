
// Google Cloud Vision API for OCR (Text Detection from Images)

// Use the provided API key
const VISION_API_KEY = "AIzaSyBJsesE28RBuRvgiTauJqgc93osbuowxWk";
const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

// Updated Gemini API key and URL
const GEMINI_API_KEY = "AIzaSyDlpkHivaQRi92dE_U9CiXS16TtWZkfnAk";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface TextDetectionResult {
  text: string;
  isPrescription: boolean;
  medicineNames: string[];
  confidence: number;
}

/**
 * Detect text from an image using Google Cloud Vision API
 * @param imageBase64 - Base64 encoded image without the prefix
 */
export const detectTextFromImage = async (imageBase64: string): Promise<TextDetectionResult> => {
  try {
    console.log("Starting text detection from image");
    
    // For placeholder image in demo, use mock data with high accuracy
    if (imageBase64 === "/placeholder.svg") {
      console.log("Using placeholder image for testing");
      // Wait to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      return await generateMockResultForTesting();
    }
    
    // First try Vision API, then fall back to Gemini
    try {
      const response = await fetch(`${VISION_API_URL}?key=${VISION_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: imageBase64
              },
              features: [
                {
                  type: "TEXT_DETECTION"
                },
                {
                  type: "DOCUMENT_TEXT_DETECTION"
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Vision API Error:", errorText);
        
        // Use Gemini API for processing the image instead
        console.log("Vision API failed, using Gemini API for image processing instead");
        return await processImageWithGemini(imageBase64);
      }

      const data = await response.json();
      console.log("Vision API response:", data);

      if (!data.responses || !data.responses[0] || !data.responses[0].textAnnotations || data.responses[0].textAnnotations.length === 0) {
        console.error("No text detected in the image");
        // Try with Gemini as backup when no text is detected
        return await processImageWithGemini(imageBase64);
      }

      // Get the full text from the first annotation
      const extractedText = data.responses[0].textAnnotations[0].description;
      console.log("Extracted text:", extractedText);

      // Use Gemini API to analyze the text and identify if it's a prescription
      const analysisResult = await analyzePrescriptionText(extractedText);
      
      return analysisResult;
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

/**
 * Process image directly with Gemini API
 * This is a fallback when Vision API fails
 */
const processImageWithGemini = async (imageBase64: string): Promise<TextDetectionResult> => {
  try {
    console.log("Attempting direct image processing with Gemini 2.0 Flash API");
    
    const prompt = `
      You are a medical assistant AI specifically trained to extract text from images of medical prescriptions with 99% accuracy.
      
      Extract ALL text from this image. Pay special attention to:
      1. Any medication names with dosages
      2. Doctor information
      3. Patient information
      4. Instructions
      
      After extracting the text, determine:
      1. Is this definitely a prescription?
      2. What medicines are mentioned? Be extremely accurate with medicine names.
      
      Format your response STRICTLY as a JSON object with this structure:
      {
        "extractedText": "full text extracted from image",
        "isPrescription": true/false,
        "medicineNames": ["Medicine1 dosage", "Medicine2 dosage"],
        "confidence": 0.X
      }
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
      
      // If using the placeholder image for demo
      if (imageBase64 === "/placeholder.svg") {
        return generateMockResultForTesting();
      }
      
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
    
    // Extract JSON from response
    const jsonStartIndex = textResponse.indexOf('{');
    const jsonEndIndex = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("Could not find JSON in Gemini response");
    }
    
    const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);
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
        throw new Error("Could not parse JSON from Gemini response");
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

/**
 * Use Gemini API to analyze prescription text
 * @param text - Extracted text from the image
 */
const analyzePrescriptionText = async (text: string): Promise<TextDetectionResult> => {
  try {
    // Enhanced prescription detection prompt with accuracy focus
    const prompt = `
      You are a medical assistant AI specifically trained to identify medical prescriptions and extract medication information with 99% accuracy.
      
      Analyze the following text extracted from an image and determine:
      
      1. Is this text DEFINITELY from a medical prescription? Be STRICT in your assessment.
      Only return true if the text contains ALL of these elements:
         - Doctor's name or signature
         - Patient information
         - Clearly identifiable medication names with dosages
         - Instructions for taking medication
      
      2. Extract all medicine names with their dosage with extreme accuracy.
      3. Provide a confidence score (0.0 to 1.0) indicating how certain you are that this is a prescription.
      
      Text from image: ${text}
      
      Format your response STRICTLY as a valid JSON object with the following structure:
      {
        "isPrescription": true/false,
        "medicineNames": ["Medicine1 dosage", "Medicine2 dosage"],
        "confidence": 0.X
      }
      
      If this is clearly NOT a prescription but contains medicine names, set isPrescription to false, but still extract medicine names accurately.
      If NO medicines are found at all, return an empty array for medicineNames.
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
    const analysisResult = JSON.parse(jsonString);
    
    // Return the result with possibly enhanced medicine names
    return {
      text,
      isPrescription: analysisResult.isPrescription,
      medicineNames: analysisResult.medicineNames || [],
      confidence: analysisResult.confidence || 0
    };
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
const extractMedicineNames = async (text: string): Promise<string[]> => {
  try {
    const prompt = `
      You are a medical assistant AI that specializes in identifying medication names with 99% accuracy.
      
      Extract ALL possible medication names from the following text, even if it doesn't look like a formal prescription.
      Look for any words that could represent medications, including generic and brand names.
      Include dosage information if available.
      
      Text: ${text}
      
      Format your response STRICTLY as a valid JSON array of strings, each containing a medicine name with dosage when available:
      ["Medicine1 dosage", "Medicine2 dosage", "Medicine3"]
      
      If absolutely NO medicine names can be found in the text, return an empty array: []
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
    
    // Extract JSON from the response
    const jsonStartIndex = textResponse.indexOf('[');
    const jsonEndIndex = textResponse.lastIndexOf(']') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      console.error("Could not find JSON in medicine extraction response");
      return [];
    }
    
    const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);
    console.log("Medicine extraction JSON:", jsonString);
    
    try {
      const medicines = JSON.parse(jsonString);
      return Array.isArray(medicines) ? medicines : [];
    } catch (parseError) {
      console.error("Error parsing medicine JSON:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error extracting medicine names:", error);
    return [];
  }
};

// Function to generate realistic testing data
export const generateMockResultForTesting = (): TextDetectionResult => {
  return {
    text: "Dr. Jane Smith\nPatient: John Doe\nDate: 12/04/2025\n\nRx:\n1. Amoxicillin 500mg - Take 1 capsule three times daily for 7 days\n2. Voglibet GM 2 - Take 1 tablet before meals\n3. Cetirizine 10mg - Take 1 tablet daily for allergies\n\nRefill: 0\nDr. Smith",
    isPrescription: true,
    medicineNames: ["Amoxicillin 500mg", "Voglibet GM 2", "Cetirizine 10mg"],
    confidence: 0.95
  };
};
