
import { useToast } from "@/components/ui/use-toast";

const GEMINI_API_KEY = "AIzaSyA14PtGblA4oPXh2dqC51Mpvymc9hNHuPI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

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
        }]
      })
    });

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      throw new Error("Failed to analyze symptoms with Gemini");
    }

    const data = await response.json();
    
    // Extract the JSON from the text response
    const textResponse = data.candidates[0].content.parts[0].text;
    const jsonStartIndex = textResponse.indexOf('{');
    const jsonEndIndex = textResponse.lastIndexOf('}') + 1;
    const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);
    
    // Parse the JSON
    const parsedResponse = JSON.parse(jsonString) as GeminiResponse;
    
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw error;
  }
};
