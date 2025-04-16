
/**
 * Generic API client
 */

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers
    };
  }

  public async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Error in GET request to ${endpoint}:`, error);
      throw error;
    }
  }

  public async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Error in POST request to ${endpoint}:`, error);
      throw error;
    }
  }
}
