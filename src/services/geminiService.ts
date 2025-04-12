
const API_KEY = "AIzaSyCBFoZB-8xBlMlHE1DNlPh2G3ZnPPSRp14"; // Using the API key from the code
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

export interface GeminiResponse {
  analysis: string;
  recommendedMedicines: string[];
  exerciseRecommendations: string[];
  cureOptions: string[];
  severity: "low" | "medium" | "high";
  seekMedicalAttention: boolean;
}

export const analyzeSymptoms = async (
  symptoms: string[],
  additionalInfo: string = ""
): Promise<GeminiResponse> => {
  try {
    console.log("Starting symptom analysis with:", { symptoms, additionalInfo });
    
    const prompt = `
      You are a medical assistant AI. Analyze the following symptoms and provide a structured response.
      
      Symptoms: ${symptoms.join(", ")}
      Additional Information: ${additionalInfo}
      
      Provide a detailed analysis including:
      1. What these symptoms could indicate
      2. Recommended over-the-counter medicines
      3. Exercise recommendations that might help
      4. Home remedies or self-care options
      5. Rate the severity as either "low", "medium", or "high"
      6. Whether immediate medical attention is recommended (true or false)
      
      Format your response STRICTLY as a valid JSON object with the following structure:
      {
        "analysis": "detailed analysis of symptoms",
        "recommendedMedicines": ["medicine1", "medicine2", "medicine3"],
        "exerciseRecommissions": ["exercise1", "exercise2", "exercise3"],
        "cureOptions": ["option1", "option2", "option3"],
        "severity": "low/medium/high",
        "seekMedicalAttention": true/false
      }
      
      IMPORTANT: Provide only the JSON object with no other text.
    `;

    console.log("Sending request to Gemini API...");
    
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
          temperature: 0.4,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error response:", errorText);
      throw new Error(`Failed to analyze symptoms: ${errorText}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response format from Gemini API");
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    console.log("Text response:", textResponse);
    
    // Extract JSON from the response
    const jsonStartIndex = textResponse.indexOf('{');
    const jsonEndIndex = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      console.error("Could not find JSON in response:", textResponse);
      throw new Error("Invalid response format: Could not extract JSON");
    }
    
    const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);
    console.log("Extracted JSON:", jsonString);
    
    try {
      // Fix common JSON issues from AI responses
      const cleanedJson = jsonString
        .replace(/"exerciseRecommissions":/g, '"exerciseRecommendations":')
        .replace(/\n/g, ' ')
        .replace(/\\/g, '\\\\')
        .replace(/\\"/g, '\\"')
        .replace(/"/g, '"')
        .replace(/"/g, '"')
        .replace(/'/g, "'")
        .replace(/'/g, "'");
      
      console.log("Cleaned JSON:", cleanedJson);
      const parsedResponse = JSON.parse(cleanedJson) as GeminiResponse;
      
      // Ensure the response has all required properties
      if (!parsedResponse.recommendedMedicines) {
        parsedResponse.recommendedMedicines = [];
      }
      
      if (!parsedResponse.exerciseRecommendations && parsedResponse['exerciseRecommissions']) {
        // Fix for potential typo in the API response
        parsedResponse.exerciseRecommendations = parsedResponse['exerciseRecommissions'] as string[];
      } else if (!parsedResponse.exerciseRecommendations) {
        parsedResponse.exerciseRecommendations = [];
      }
      
      if (!parsedResponse.cureOptions) {
        parsedResponse.cureOptions = [];
      }
      
      console.log("Final parsed response:", parsedResponse);
      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      throw new Error(`Failed to parse response: ${parseError}`);
    }
  } catch (error) {
    console.error("Error in analyzeSymptoms:", error);
    throw error;
  }
};
