
// API Keys
export const GEMINI_API_KEY = "AIzaSyDlpkHivaQRi92dE_U9CiXS16TtWZkfnAk";

// API Endpoints
export const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Other constants
export const GOOGLE_SERVICE_ACCOUNT = "your_service_account@example.com"; // Replace with actual service account if needed

// Adding the missing VISION_SERVICE_ACCOUNT constant
export const VISION_SERVICE_ACCOUNT = {
  client_email: "vision-api@example.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEpQIBAAKCAQEAxxxxxxxx\n-----END PRIVATE KEY-----\n",
  private_key_id: "example_key_id"
};
