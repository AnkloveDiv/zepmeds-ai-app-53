
/**
 * Base API Service for Zepmeds
 * 
 * Provides the foundation for all API services with common methods and configuration
 */

export class BaseApiService {
  protected apiBaseUrl: string;
  protected apiKey: string;
  protected maxRetries: number = 3;
  
  constructor(
    apiBaseUrl: string = 'https://preview--zepmeds-admin-hub-72.lovable.app/api',
    apiKey: string = ''
  ) {
    this.apiBaseUrl = apiBaseUrl;
    this.apiKey = apiKey;
  }
  
  /**
   * Send a POST request to the API
   */
  protected async apiPost(endpoint: string, data: any, retryCount: number = 0): Promise<any> {
    try {
      console.log(`[API] POST ${this.apiBaseUrl}${endpoint}`, data);
      
      const headers = this.getHeaders();
      const body = JSON.stringify(data);
      
      // Add mode: 'cors' for cross-origin requests
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: body,
        mode: 'cors',
        credentials: 'omit'  // Don't send cookies to avoid authentication issues
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}): ${errorText}`);
        
        // Retry logic for recoverable errors
        if (retryCount < this.maxRetries && (response.status >= 500 || response.status === 429)) {
          console.log(`Retrying request to ${endpoint} (attempt ${retryCount + 1})`);
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.apiPost(endpoint, data, retryCount + 1);
        }
        
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      try {
        const responseData = await response.json();
        console.log(`API Response from ${endpoint}:`, responseData);
        return responseData;
      } catch (e) {
        console.log(`No JSON response from ${endpoint}, returning success`);
        return { success: true }; // Return success if not JSON response
      }
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      
      // Retry logic for network errors
      if (retryCount < this.maxRetries) {
        console.log(`Retrying request to ${endpoint} due to network error (attempt ${retryCount + 1})`);
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.apiPost(endpoint, data, retryCount + 1);
      }
      
      throw error;
    }
  }
  
  /**
   * Send a GET request to the API
   */
  protected async apiGet(endpoint: string, queryParams: Record<string, string> = {}, retryCount: number = 0): Promise<any> {
    try {
      // Construct URL with query parameters
      const url = new URL(`${this.apiBaseUrl}${endpoint}`);
      Object.keys(queryParams).forEach(key => {
        url.searchParams.append(key, queryParams[key]);
      });
      
      console.log(`[API] GET ${url.toString()}`);
      
      // In a real implementation using fetch with proper error handling
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
        mode: 'cors', // Enable cross-origin requests
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}): ${errorText}`);
        
        // Retry logic for recoverable errors
        if (retryCount < this.maxRetries && (response.status >= 500 || response.status === 429)) {
          console.log(`Retrying request to ${endpoint} (attempt ${retryCount + 1})`);
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.apiGet(endpoint, queryParams, retryCount + 1);
        }
        
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log(`API Response from ${endpoint}:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      
      // Retry logic for network errors
      if (retryCount < this.maxRetries) {
        console.log(`Retrying request to ${endpoint} due to network error (attempt ${retryCount + 1})`);
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.apiGet(endpoint, queryParams, retryCount + 1);
      }
      
      throw error;
    }
  }
  
  /**
   * Get headers for API requests
   */
  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-App-Source': 'zepmeds-mobile-app',
      'X-App-Version': '1.0.0',
      'Accept': 'application/json'
    };
  }
}
