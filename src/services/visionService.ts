
// Google Cloud Vision API for OCR (Text Detection from Images)

// Use the provided API key
const VISION_API_KEY = "AIzaSyBJsesE28RBuRvgiTauJqgc93osbuowxWk";
const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

export interface TextDetectionResult {
  text: string;
  isPrescription: boolean;
  medicineNames: string[];
  confidence: number;
}

// Mock data for testing
const mockTextResult: TextDetectionResult = {
  text: "Dr. Jane Smith\nPatient: John Doe\nDate: 12/04/2025\n\nRx:\n1. Amoxicillin 500mg - Take 1 capsule three times daily for 7 days\n2. Ibuprofen 400mg - Take 1 tablet as needed for pain every 6 hours\n3. Cetirizine 10mg - Take 1 tablet daily for allergies\n\nRefill: 0\nDr. Smith",
  isPrescription: true,
  medicineNames: ["Amoxicillin 500mg", "Ibuprofen 400mg", "Cetirizine 10mg"],
  confidence: 0.95
};

/**
 * Detect text from an image using Google Cloud Vision API
 * @param imageBase64 - Base64 encoded image without the prefix
 */
export const detectTextFromImage = async (imageBase64: string): Promise<TextDetectionResult> => {
  try {
    console.log("Starting text detection from image");
    
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
      throw new Error(`Vision API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Vision API response:", data);

    if (!data.responses || !data.responses[0] || !data.responses[0].textAnnotations || data.responses[0].textAnnotations.length === 0) {
      console.error("No text detected in the image");
      return {
        text: "",
        isPrescription: false,
        medicineNames: [],
        confidence: 0
      };
    }

    // Get the full text from the first annotation
    const extractedText = data.responses[0].textAnnotations[0].description;
    console.log("Extracted text:", extractedText);

    // Use Gemini API to analyze the text and identify if it's a prescription
    const analysisResult = await analyzePrescriptionText(extractedText);
    return analysisResult;
  } catch (error) {
    console.error("Error in text detection:", error);
    // Return invalid result instead of using mockResult
    return {
      text: "",
      isPrescription: false,
      medicineNames: [], // Important: Empty array when invalid
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
    const API_KEY = "AIzaSyDlpkHivaQRi92dE_U9CiXS16TtWZkfnAk";
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    
    // More robust prescription detection prompt
    const prompt = `
      You are a medical assistant AI specifically trained to identify medical prescriptions and extract medication information.
      
      Analyze the following text extracted from an image and determine:
      
      1. Is this text DEFINITELY from a medical prescription? Be STRICT in your assessment.
      Only return true if the text contains ALL of these elements:
         - Doctor's name or signature
         - Patient information
         - Clearly identifiable medication names with dosages
         - Instructions for taking medication
      
      2. If it is a prescription, extract all medicine names with their dosage.
      3. Provide a confidence score (0.0 to 1.0) indicating how certain you are that this is a prescription.
      
      Text from image: ${text}
      
      Format your response STRICTLY as a valid JSON object with the following structure:
      {
        "isPrescription": true/false,
        "medicineNames": ["Medicine1 dosage", "Medicine2 dosage"],
        "confidence": 0.X
      }
      
      IMPORTANT: If this is clearly NOT a prescription, set isPrescription to false, return an empty array for medicineNames, and a low confidence value.
    `;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
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
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonStartIndex = textResponse.indexOf('{');
    const jsonEndIndex = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("Could not find JSON in response");
    }
    
    const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);
    const analysisResult = JSON.parse(jsonString);
    
    // Ensure medicine names is empty when isPrescription is false
    return {
      text,
      isPrescription: analysisResult.isPrescription,
      medicineNames: analysisResult.isPrescription ? (analysisResult.medicineNames || []) : [],
      confidence: analysisResult.confidence || 0
    };
  } catch (error) {
    console.error("Error analyzing prescription text:", error);
    
    // Return invalid result with empty medicine names
    return {
      text,
      isPrescription: false,
      medicineNames: [], // Important: Empty array when invalid
      confidence: 0.1
    };
  }
};

// Optional function if we need to generate mock data in special cases
const generateMockResultWithRandomData = (): TextDetectionResult => {
  return {
    ...mockTextResult,
    confidence: Math.random() // Random confidence level to make it more realistic
  };
};
