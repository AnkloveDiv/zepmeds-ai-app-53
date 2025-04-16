
import { toast } from "sonner";

// Gemini API key for image generation
const GEMINI_API_KEY = "AIzaSyDlpkHivaQRi92dE_U9CiXS16TtWZkfnAk";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function generateMedicineImage(medicineName: string, description?: string): Promise<string> {
  try {
    // Default placeholder for testing or if API fails
    const fallbackImage = "/placeholder.svg";
    
    // Create a descriptive prompt for the medicine
    const prompt = `Create a photorealistic product image of "${medicineName}" medicine.
    ${description ? `This is: ${description}.` : ''}
    Make it look like a professional pharmaceutical product with clean packaging.
    Include the name "${medicineName}" on the packaging.
    Add a medical or pharmaceutical company logo.
    Use a clean background.
    Make it high quality and realistic.`;
    
    console.log("Generating image for:", medicineName);
    console.log("Using prompt:", prompt);
    
    // Make the API request to Gemini
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
          temperature: 0.4,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return fallbackImage;
    }
    
    const data = await response.json();
    
    // Since this is a text model, not an image generation model,
    // we'll use a text-based description to generate a placeholder image
    // In a production environment, you would use a proper image generation API
    console.log("Generated text response:", data);
    
    // Return a placeholder image that looks like medicine
    const imageUrlBase = "https://source.unsplash.com/random/300x300/?medicine,";
    return `${imageUrlBase}${encodeURIComponent(medicineName)}`;
    
  } catch (error) {
    console.error("Error generating medicine image:", error);
    toast.error("Failed to generate medicine image");
    return "/placeholder.svg";
  }
}
