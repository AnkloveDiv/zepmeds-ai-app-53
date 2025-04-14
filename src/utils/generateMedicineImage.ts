
import { toast } from "sonner";

// Gemini API key for image generation
const GEMINI_API_KEY = "AIzaSyDlpkHivaQRi92dE_U9CiXS16TtWZkfnAk";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro-vision:generateContent";

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
    
    // Check if the response contains an image
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData?.mimeType?.startsWith("image/")
    );
    
    if (imagePart?.inlineData) {
      // Get the base64 data for the image
      const imageData = imagePart.inlineData.data;
      
      // Create a blob from the base64 data
      const byteCharacters = atob(imageData);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      
      return imageUrl;
    } else {
      console.error("No image generated from Gemini API");
      return fallbackImage;
    }
  } catch (error) {
    console.error("Error generating medicine image:", error);
    toast.error("Failed to generate medicine image");
    return "/placeholder.svg";
  }
}
