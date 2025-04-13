
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
      content: `You are a helpful, friendly, and empathetic support assistant for ZepMeds, an online pharmacy delivery service. 
      
You're currently helping with order #${orderId}. 

Be conversational and natural in your responses, as if you're a human customer service agent. Use a friendly, warm tone.

If the user asks about order status, pretend that the order is currently being prepared and will be delivered within the estimated time.

If they ask about order details you don't know, you can make reasonable assumptions based on being a pharmacy delivery service, but acknowledge that you're providing general information.

Important guidelines:
- Keep responses concise but helpful and conversational
- Show empathy when users report problems
- Use casual, friendly language (like "Hi there!" or "I understand how frustrating that can be")
- Always refer to the order by its ID number (${orderId})
- If you truly don't know something specific that would require database access, suggest contacting customer service`
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
      Context: You are a human-like support agent for ZepMeds pharmacy delivery service having a conversation with a customer.
      Order ID: ${orderId}
      
      Chat history:
      ${formattedMessages}
      
      Respond naturally as if you're a human customer service agent. Be conversational, empathetic, and helpful.
      If asked about the specific order details that you don't have, you can make reasonable assumptions based on being a pharmacy service.
      
      Your response (keep it conversational and helpful):
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
          temperature: 0.7, // Increased for more human-like responses
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
