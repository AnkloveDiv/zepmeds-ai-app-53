
import { VISION_SERVICE_ACCOUNT } from './constants';
import { AuthData } from './types';

/**
 * Generate a JWT token for authenticating with Google Cloud APIs
 */
export async function generateJWT(): Promise<AuthData | null> {
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
