
import { supabase } from '@/integrations/supabase/client';
import { initializeDashboardSync } from '@/services/dashboardSubscription';
import { getDashboardApiService } from '@/services/dashboardApiService';

// Initialize dashboard API service
const dashboardApiService = getDashboardApiService('https://lovable.dev/projects/248b8658-2f81-447e-bdf7-e30916a3844a/api');
console.log('Dashboard API service initialized');

// Initialize dashboard sync with the admin hub
initializeDashboardSync('https://lovable.dev/projects/248b8658-2f81-447e-bdf7-e30916a3844a/api');

// Export the supabase client for use throughout the app
export { supabase, dashboardApiService };

// Database schema for emergency services
/* 
Tables:

1. emergency_requests
   - id (uuid, primary key)
   - user_id (uuid, foreign key to users)
   - request_type (text) - ambulance, medical, etc.
   - status (text) - requested, dispatched, in_progress, completed, cancelled
   - location_lat (float)
   - location_lng (float)
   - address (text)
   - description (text)
   - created_at (timestamp)
   - updated_at (timestamp)

2. emergency_responders
   - id (uuid, primary key)
   - name (text)
   - vehicle_number (text)
   - phone_number (text)
   - status (text) - available, assigned, off_duty
   - location_lat (float)
   - location_lng (float)
   - created_at (timestamp)
   - updated_at (timestamp)

3. emergency_assignments
   - id (uuid, primary key)
   - emergency_request_id (uuid, foreign key to emergency_requests)
   - responder_id (uuid, foreign key to emergency_responders)
   - assigned_at (timestamp)
   - eta_minutes (integer)
   - status (text) - assigned, arrived, completed
   - notes (text)
   - created_at (timestamp)
   - updated_at (timestamp)
*/
