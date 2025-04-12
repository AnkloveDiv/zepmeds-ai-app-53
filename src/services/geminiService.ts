
const GEMINI_API_KEY = "AIzaSyCUtHkOxTdEXPRnVUhZtz9qERyUaw_RDXI";
// Updated API URL to use gemini-pro model (Gemini 1.0) instead of gemini-1.0-pro
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

export interface GeminiResponse {
  analysis: string;
  recommendedMedicines: string[];
  exerciseRecommendations: string[];
  cureOptions: string[];
  severity: "low" | "medium" | "high";
  seekMedicalAttention: boolean;
}

export const analyzeSymptoms = async (symptoms: string[], additionalInfo: string = ""): Promise<GeminiResponse> => {
  try {
    // Creating a detailed prompt for Gemini to analyze symptoms
    const prompt = `
      Act as a medical assistant providing information about symptoms. Analyze the following symptoms:
      ${symptoms.join(", ")}
      
      Additional information: ${additionalInfo}
      
      Provide a detailed analysis including:
      1. What these symptoms might indicate
      2. A list of potential recommended over-the-counter medicines that might help
      3. Exercise recommendations that could alleviate these symptoms
      4. Ways to cure or manage these symptoms at home
      5. Rate the severity as "low", "medium", or "high"
      6. Indicate if the person should seek immediate medical attention (true/false)
      
      Format your response strictly as JSON with the following structure:
      {
        "analysis": "detailed analysis of symptoms",
        "recommendedMedicines": ["medicine1", "medicine2", "medicine3"],
        "exerciseRecommendations": ["exercise1", "exercise2", "exercise3"],
        "cureOptions": ["cure1", "cure2", "cure3"],
        "severity": "low|medium|high",
        "seekMedicalAttention": true|false
      }
      
      Important: Always include a disclaimer that this is not professional medical advice and the user should consult a healthcare professional for proper diagnosis and treatment.
    `;

    console.log("Sending request to Gemini API with symptoms:", symptoms);
    
    // Making the API request to Gemini with updated structure
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error("Failed to analyze symptoms with Gemini");
    }

    const data = await response.json();
    console.log("Gemini API response:", data);
    
    // Extract the JSON from the text response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Find the JSON object in the response text
    const jsonStartIndex = textResponse.indexOf('{');
    const jsonEndIndex = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      console.error("Could not find JSON in response:", textResponse);
      throw new Error("Invalid response format from Gemini");
    }
    
    const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);
    
    try {
      // Parse the JSON
      const parsedResponse = JSON.parse(jsonString) as GeminiResponse;
      return parsedResponse;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError, "Response was:", jsonString);
      throw new Error("Failed to parse Gemini response");
    }
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw error;
  }
};
