
import { supabase } from '@/integrations/supabase/client';

// Export the supabase client for use throughout the app
export { supabase };

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
