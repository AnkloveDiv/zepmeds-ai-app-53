
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize dashboard synchronization
 */
export const initializeDashboardSync = (
  dashboardApiUrl?: string, 
  apiKey?: string
): void => {
  const service = getDashboardSyncService(dashboardApiUrl, apiKey);
  service.initialize();
  console.log('Dashboard synchronization initialized');
};

/**
 * Clean up dashboard synchronization
 */
export const cleanupDashboardSync = (): void => {
  if (dashboardSyncInstance) {
    dashboardSyncInstance.cleanup();
    console.log('Dashboard synchronization cleaned up');
  }
};

/**
 * DashboardSyncService
 * 
 * This service manages real-time data synchronization between the Zepmeds app
 * and the Zepmeds Ambulance dashboard using Supabase Realtime subscriptions.
 */
export class DashboardSyncService {
  private subscriptions: any[] = [];
  private dashboardApiUrl: string;
  private apiKey: string;
  
  constructor(dashboardApiUrl: string = 'https://api.zepmeds-dashboard.example', apiKey: string = '') {
    this.dashboardApiUrl = dashboardApiUrl;
    this.apiKey = apiKey;
    console.log('DashboardSyncService created with URL:', dashboardApiUrl);
  }
  
  /**
   * Initialize all real-time subscriptions for dashboard synchronization
   */
  public initialize(): void {
    console.log('Initializing dashboard subscriptions');
    this.subscribeToEmergencyRequests();
    this.subscribeToEmergencyAssignments();
  }
  
  /**
   * Unsubscribe from all real-time channels
   */
  public cleanup(): void {
    console.log('Cleaning up dashboard subscriptions');
    this.subscriptions.forEach(subscription => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    });
    this.subscriptions = [];
  }
  
  /**
   * Subscribe to changes in emergency requests table
   */
  private subscribeToEmergencyRequests(): void {
    console.log('Subscribing to emergency requests');
    try {
      const subscription = supabase
        .channel('emergency_requests_channel')
        .on(
          'postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'emergency_requests' }, 
          payload => {
            console.log('New emergency request detected:', payload.new);
            this.handleNewEmergencyRequest(payload.new);
          }
        )
        .on(
          'postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'emergency_requests' }, 
          payload => {
            console.log('Updated emergency request detected:', payload.new);
            this.handleUpdatedEmergencyRequest(payload.new, payload.old);
          }
        )
        .subscribe((status) => {
          console.log('Emergency requests subscription status:', status);
        });
      
      this.subscriptions.push(subscription);
    } catch (error) {
      console.error('Error subscribing to emergency requests:', error);
    }
  }
  
  /**
   * Subscribe to changes in emergency assignments table
   */
  private subscribeToEmergencyAssignments(): void {
    console.log('Subscribing to emergency assignments');
    try {
      const subscription = supabase
        .channel('emergency_assignments_channel')
        .on(
          'postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'emergency_assignments' }, 
          payload => {
            console.log('New emergency assignment detected:', payload.new);
            this.handleNewEmergencyAssignment(payload.new);
          }
        )
        .on(
          'postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'emergency_assignments' }, 
          payload => {
            console.log('Updated emergency assignment detected:', payload.new);
            this.handleUpdatedEmergencyAssignment(payload.new, payload.old);
          }
        )
        .subscribe((status) => {
          console.log('Emergency assignments subscription status:', status);
        });
      
      this.subscriptions.push(subscription);
    } catch (error) {
      console.error('Error subscribing to emergency assignments:', error);
    }
  }
  
  /**
   * Handle new emergency request
   */
  private async handleNewEmergencyRequest(request: any): Promise<void> {
    try {
      console.log('Processing new emergency request:', request);
      // Fetch additional user information if needed
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('name, phone, medical_conditions')
        .eq('id', request.user_id)
        .single();
      
      if (userError) {
        console.log('No user profile found for id:', request.user_id);
      }
      
      // Format data for dashboard
      const dashboardData = {
        requestId: request.id,
        requestType: request.request_type,
        status: request.status,
        location: {
          lat: request.location_lat,
          lng: request.location_lng,
          address: request.address
        },
        user: userData || { id: request.user_id },
        description: request.description,
        created_at: request.created_at,
        source: 'mobile_app'
      };
      
      // Send to dashboard
      await this.sendToDashboard('/emergency/new', dashboardData);
    } catch (error) {
      console.error('Error handling new emergency request:', error);
    }
  }
  
  /**
   * Handle updated emergency request
   */
  private async handleUpdatedEmergencyRequest(newData: any, oldData: any): Promise<void> {
    try {
      // Only send updates for relevant status changes
      if (newData.status !== oldData.status) {
        console.log(`Emergency request status changed from ${oldData.status} to ${newData.status}`);
        
        const dashboardData = {
          requestId: newData.id,
          previousStatus: oldData.status,
          newStatus: newData.status,
          updated_at: newData.updated_at,
          source: 'mobile_app'
        };
        
        await this.sendToDashboard('/emergency/update', dashboardData);
      }
    } catch (error) {
      console.error('Error handling updated emergency request:', error);
    }
  }
  
  /**
   * Handle new emergency assignment
   */
  private async handleNewEmergencyAssignment(assignment: any): Promise<void> {
    try {
      console.log('Processing new emergency assignment:', assignment);
      
      // Fetch related data
      const { data: requestData, error: requestError } = await supabase
        .from('emergency_requests')
        .select('user_id, request_type, status, location_lat, location_lng, address, description')
        .eq('id', assignment.emergency_request_id)
        .single();
        
      if (requestError) {
        console.error('Error fetching emergency request:', requestError);
      }
      
      const { data: responderData, error: responderError } = await supabase
        .from('emergency_responders')
        .select('name, vehicle_number, phone_number')
        .eq('id', assignment.responder_id)
        .single();
      
      if (responderError) {
        console.error('Error fetching responder:', responderError);
      }
      
      if (!requestData || !responderData) {
        console.log('Missing request or responder data, skipping dashboard update');
        return;
      }
      
      const dashboardData = {
        assignmentId: assignment.id,
        requestId: assignment.emergency_request_id,
        responderId: assignment.responder_id,
        responder: responderData,
        request: requestData,
        eta: assignment.eta_minutes,
        status: assignment.status,
        assigned_at: assignment.assigned_at,
        source: 'mobile_app'
      };
      
      await this.sendToDashboard('/emergency/assignment', dashboardData);
    } catch (error) {
      console.error('Error handling new emergency assignment:', error);
    }
  }
  
  /**
   * Handle updated emergency assignment
   */
  private async handleUpdatedEmergencyAssignment(newData: any, oldData: any): Promise<void> {
    try {
      if (newData.status !== oldData.status || newData.eta_minutes !== oldData.eta_minutes) {
        console.log('Emergency assignment updated:', {
          status: `${oldData.status} → ${newData.status}`, 
          eta: `${oldData.eta_minutes} → ${newData.eta_minutes} minutes`
        });
        
        const dashboardData = {
          assignmentId: newData.id,
          requestId: newData.emergency_request_id,
          responderId: newData.responder_id,
          previousStatus: oldData.status,
          newStatus: newData.status,
          previousEta: oldData.eta_minutes,
          newEta: newData.eta_minutes,
          updated_at: newData.updated_at,
          source: 'mobile_app'
        };
        
        await this.sendToDashboard('/emergency/assignment/update', dashboardData);
      }
    } catch (error) {
      console.error('Error handling updated emergency assignment:', error);
    }
  }
  
  /**
   * Send data to dashboard API
   */
  private async sendToDashboard(endpoint: string, data: any): Promise<any> {
    try {
      console.log(`Sending data to dashboard ${endpoint}:`, data);
      
      // For now, we're mocking the API call since this is just for demonstration
      // In a real app, this would make an actual API request
      console.log(`[DASHBOARD API MOCK] POST ${this.dashboardApiUrl}${endpoint}`);
      
      // Simulate successful API response
      return {
        success: true,
        message: `Data sent to ${endpoint} successfully`,
        data: data
      };
      
      // In a real implementation, this would be:
      /*
      const response = await fetch(`${this.dashboardApiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send data to dashboard: ${response.statusText}`);
      }
      
      return await response.json();
      */
    } catch (error) {
      console.error(`Error sending data to ${endpoint}:`, error);
      return null;
    }
  }
}

// Singleton instance for app-wide use
let dashboardSyncInstance: DashboardSyncService | null = null;

/**
 * Get or create the dashboard sync service
 */
export const getDashboardSyncService = (
  dashboardApiUrl?: string, 
  apiKey?: string
): DashboardSyncService => {
  if (!dashboardSyncInstance) {
    dashboardSyncInstance = new DashboardSyncService(dashboardApiUrl, apiKey);
  }
  return dashboardSyncInstance;
};
