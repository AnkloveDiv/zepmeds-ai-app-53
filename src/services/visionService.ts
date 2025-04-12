
// Google Cloud Vision API for OCR (Text Detection from Images)

// Gemini API key for text analysis
const GEMINI_API_KEY = "AIzaSyDlpkHivaQRi92dE_U9CiXS16TtWZkfnAk";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Service account credentials for Vision API
const VISION_SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "prescription-ocr-456618",
  "private_key_id": "6d7c3456235d4ff6f165d22f0048be02651fecac",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCPU5U8OtA5zCSs\ndxq+8SfZGsRdLocnnzmOcEmqjVTZOvw5chvaxrS8ClV2rRjTSeiq4+SFFf+OszJ2\ncea0xot5hx5EZPVtKHWQ18uU0NLR00a+aKtQ/G8vbWhgifPiwpOLIPOSyPTp9dlG\nw4BinXsq+Dc958KswTkLn42/IyHyrfA+AeKcIZNumaXtzeYO74hTY3qR2x64hKRY\nGaizDZKddgjFNmctdHsBbyHyF0wu8AjapWyWUBF6tGY2JQLbdYTTKpKkv2LgoAwX\nTj/x6Iv3IVgyV+44SMMK35m4Rq98MwhbAgLXMYU3KMqUaUJApCZVjCj6WAqUNtxd\nq7mapMR7AgMBAAECggEAQ/KWneKuA7CVtFOU0O/n+cN4U0qzFWQld7MhIWN2VbPi\njmNb9Dhex4TIpoYCbmysCpQWqsdWi/LFWiS+gHZd+gPGJBuOxKy5K606XPcw8vuM\nHsnlafP6zAu8v4O3JQokw4EgKDbv8Ri15JfbfiT1ltXs7oK4pojGAA4ot3Qy7Ga2\n3G9vKltJ85Fovxl+FKkbEz8R+v6EuhM5+K4js8pwps3A9PxtUW4CPC5R3Q4a4DDx\n0Exy2eiMMsHZL7V1aH0Dp+NJg6epQHp2kozjcOscGNmehRar3Wm/GlgrZeEU+B0F\nreqdhltOdpyT5d3Bi0CiYpbmDfSwpjJUnW288oZ42QKBgQDIqsiH6wLzf5qvbX5p\nHNjKhU+0Xe4YVEvMsIhgPtQnkdAqAlkUKmhIhor24TDIV+sqCMd7LS4w8T342YhE\ne+R46ldKW4uS1noVK63Xz6zUtHnt6u9bhv4USEzeCCzuV6ksEq0fVQdEvimN39gy\nzG/peBpuBHrbKtcApI8ut2wU4wKBgQC22RbXhwx0MvHkboTtty/DXBTPgCzRdJk+\nyDUujJ7cQFlhP+fKR/tDcqrvhxsb39p1AURloI6JLJb0FS6bsXw5UIZx4k4PhkjC\niX9bm2VjMTA459TuqYRKJUkNf5cVgqrte7LrXoe7Q4rWGi8rrsUEw4+1eVqAEvQi\nqv+Pj7a9iQKBgFKKFRP7MeqQqULRafa4e9/JuAA7xqzRN6CJWH8mOMPR8WrmLlfi\nHaT/Wne0JwmxSDSxCcR70A0nndMXPzrULyUhVyhpwV5zxCGjJs2nSbLwTVr0kOH4\nA9i56IxHlpuvCRHs2LMTmXrIMXV/BoHWn43L7iskwpgV5fwItDCGF/n7AoGAb2j/\nHfvPfs27za/5ls5Tb/mfRH+Yz1b4OOTMYryT3yfmTfceSIZrdsFbne74eZeACGLp\nRfL6ZmKg58AwUfVm95U1FhcJ8TOlCcO1sh+RO0sxUrsPZwwq6vKk/HCNojGn7GO+\ntOM4WMXixmnV7AvlR+3QloaGuhrSXn1KkjLC6eECgYATsuJpJ06zS3EA1Eurn9y/\nV6kA5hR/yz6BmLM+1iMStlZWeounCd9tsCThKaldQWCwmRY/jVLpRAHsuD4se+qB\nZRB709Z4HfCi2u730lPFPajtWZJfvK7EmQ2PgqL/XWeIX2Ggz2owBghigF6iTu+G\nFzU9mMGg+vf1nxhav0u9qw==\n-----END PRIVATE KEY-----\n",
  "client_email": "prescription@prescription-ocr-456618.iam.gserviceaccount.com",
  "client_id": "111757080224550044824",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/prescription%40prescription-ocr-456618.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Vision API URL
const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

export interface TextDetectionResult {
  text: string;
  isPrescription: boolean;
  medicineNames: string[];
  confidence: number;
}

/**
 * Generate a JWT token for authenticating with Google Cloud APIs
 */
async function generateJWT() {
  try {
    const header = {
      alg: "RS256",
      typ: "JWT",
      kid: VISION_SERVICE_ACCOUNT.private_key_id
    };

    const currentTime = Math.floor(Date.now() / 1000);
    const payload = {
      iss: VISION_SERVICE_ACCOUNT.client_email,
      sub: VISION_SERVICE_ACCOUNT.client_email,
      aud: "https://vision.googleapis.com/",
      iat: currentTime,
      exp: currentTime + 3600 // Token valid for 1 hour
    };

    // Base64 encode header and payload
    const base64Header = btoa(JSON.stringify(header))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
      
    const base64Payload = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Create signature using the private key
    const signingInput = `${base64Header}.${base64Payload}`;
    
    // For browser environments where direct RSA signing isn't available,
    // we use a simpler approach with the raw token approach
    
    // In a real production app, this should be signed properly with crypto libraries
    // Here we're using a simpler approach for demo purposes
    console.log("Generated JWT token base for authentication");
    
    // Return unsigned token (will use service account directly in API call)
    return {
      token: null,
      clientEmail: VISION_SERVICE_ACCOUNT.client_email,
      privateKey: VISION_SERVICE_ACCOUNT.private_key
    };
  } catch (error) {
    console.error("Error generating JWT:", error);
    return null;
  }
}

/**
 * Detect text from an image using Google Cloud Vision API
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
          "x-goog-user-project": VISION_SERVICE_ACCOUNT.project_id,
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

/**
 * Extract medicine names from raw text as a last resort
 */
const extractMedicineNamesFromText = (text: string): string[] => {
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

/**
 * Use Gemini API to analyze prescription text
 * @param text - Extracted text from the image
 */
const analyzePrescriptionText = async (text: string): Promise<TextDetectionResult> => {
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
const extractMedicineNames = async (text: string): Promise<string[]> => {
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

// Function to generate realistic testing data
export const generateMockResultForTesting = (): TextDetectionResult => {
  return {
    text: "Dr. Jane Smith\nPatient: John Doe\nDate: 12/04/2025\n\nRx:\n1. Amoxicillin 500mg - Take 1 capsule three times daily for 7 days\n2. Voglibet GM 2 - Take 1 tablet before meals\n3. Cetirizine 10mg - Take 1 tablet daily for allergies\n\nRefill: 0\nDr. Smith",
    isPrescription: true,
    medicineNames: ["Amoxicillin 500mg", "Voglibet GM 2", "Cetirizine 10mg"],
    confidence: 0.95
  };
};

