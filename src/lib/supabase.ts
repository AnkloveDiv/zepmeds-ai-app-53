import { createClient } from '@supabase/supabase-js';

// These would normally come from environment variables in a production app
// For demonstration purposes, we'll keep them here 
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

Row Level Security (RLS):
1. emergency_requests:
   - Users can read and create their own emergency requests
   - Admins can read and update all emergency requests
   
2. emergency_responders:
   - Admins can read and update
   - Responders can read and update their own records
   - Users can only read responders assigned to their emergency requests
   
3. emergency_assignments:
   - Users can read assignments related to their emergency requests
   - Responders can read and update their own assignments
   - Admins can read and update all assignments
*/
