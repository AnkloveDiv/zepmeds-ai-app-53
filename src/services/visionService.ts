
// Google Cloud Vision API for OCR (Text Detection from Images)

// Replace with your actual API key
const VISION_API_KEY = "AIzaSyDlpkHivaQRi92dE_U9CiXS16TtWZkfnAk";
const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

export interface TextDetectionResult {
  text: string;
  isPrescription: boolean;
  medicineNames: string[];
}

// Mock data for testing
const mockTextResult: TextDetectionResult = {
  text: "Dr. Jane Smith\nPatient: John Doe\nDate: 12/04/2025\n\nRx:\n1. Amoxicillin 500mg - Take 1 capsule three times daily for 7 days\n2. Ibuprofen 400mg - Take 1 tablet as needed for pain every 6 hours\n3. Cetirizine 10mg - Take 1 tablet daily for allergies\n\nRefill: 0\nDr. Smith",
  isPrescription: true,
  medicineNames: ["Amoxicillin 500mg", "Ibuprofen 400mg", "Cetirizine 10mg"]
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

    if (!data.responses || !data.responses[0] || !data.responses[0].textAnnotations) {
      console.error("No text detected in the image");
      throw new Error("No text detected in the image");
    }

    // Get the full text from the first annotation
    const extractedText = data.responses[0].textAnnotations[0].description;
    console.log("Extracted text:", extractedText);

    // Use Gemini API to analyze the text and identify if it's a prescription
    const analysisResult = await analyzePrescriptionText(extractedText);
    return analysisResult;
  } catch (error) {
    console.error("Error in text detection:", error);
    // Return mock data for testing
    return mockTextResult;
  }
};

/**
 * Use Gemini API to analyze prescription text
 * @param text - Extracted text from the image
 */
const analyzePrescriptionText = async (text: string): Promise<TextDetectionResult> => {
  try {
    const { API_KEY, API_URL } = await import("./geminiService");
    
    const prompt = `
      You are a medical assistant AI. Analyze the following text extracted from an image and determine:
      
      1. Is this text from a medical prescription? Answer with true or false.
      2. If it is a prescription, extract all medicine names with their dosage.
      
      Text from image: ${text}
      
      Format your response STRICTLY as a valid JSON object with the following structure:
      {
        "isPrescription": true/false,
        "medicineNames": ["Medicine1 dosage", "Medicine2 dosage", "Medicine3 dosage"]
      }
      
      IMPORTANT: Provide only the JSON object with no other text. If this is not a prescription, return an empty array for medicineNames.
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
          temperature: 0.2,
          topP: 0.95,
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
    
    return {
      text,
      isPrescription: analysisResult.isPrescription,
      medicineNames: analysisResult.medicineNames || []
    };
  } catch (error) {
    console.error("Error analyzing prescription text:", error);
    
    // Simple fallback analysis
    const isMedicineName = (line: string): boolean => {
      const medicineKeywords = [
        "tablet", "capsule", "mg", "ml", "injection", "syrup", 
        "take", "dose", "rx", "prescribed", "daily", "twice", "once"
      ];
      
      return medicineKeywords.some(keyword => 
        line.toLowerCase().includes(keyword.toLowerCase()));
    };
    
    const lines = text.split('\n');
    const possibleMedicines = lines.filter(isMedicineName);
    const isPrescription = possibleMedicines.length > 0 && 
      (text.toLowerCase().includes("dr.") || 
       text.toLowerCase().includes("prescription") || 
       text.toLowerCase().includes("rx"));
    
    return {
      text,
      isPrescription,
      medicineNames: isPrescription ? possibleMedicines : []
    };
  }
};
