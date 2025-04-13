
import { toast } from "@/components/ui/use-toast";

// Gemini API configuration
const API_KEY = "AIzaSyDAYGKh5YofF3RP05TEjxAAimZUtpIh6qI";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Define message types
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

// Default predefined questions for the order support context
export const PREDEFINED_QUESTIONS = [
  "Where is my order right now?",
  "How can I cancel my order?",
  "Can I change my delivery address?",
  "What if I'm not available during delivery?",
  "How do I report an issue with my order?"
];

// Initialize a conversation with system prompt for order support
export const initializeOrderChat = (orderId: string): ChatMessage[] => {
  return [
    {
      role: "system",
      content: `You are a helpful and friendly support assistant for ZepMeds, an online pharmacy delivery service. You are currently helping with order #${orderId}. Keep responses concise, friendly, and accurate. If you don't know something specific about the order, suggest contacting customer service directly.`
    }
  ];
};

// Function to generate response using Gemini API
export const generateChatResponse = async (
  messages: ChatMessage[],
  orderId: string
): Promise<string> => {
  try {
    console.log("Generating response for messages:", messages);
    
    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");
    const prompt = `
      Context: You are a support agent for ZepMeds pharmacy delivery service.
      Order ID: ${orderId}
      
      Chat history:
      ${formattedMessages}
      
      Your response (keep it concise and helpful):
    `;

    console.log("Sending request to Gemini API with prompt:", prompt);

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
      const errorText = await response.text();
      console.error("API Error response:", errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Invalid response format from API");
      throw new Error("Invalid response format from Gemini API");
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    return textResponse.trim();
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm having trouble connecting right now. Please try again or contact our customer service directly.";
  }
};
