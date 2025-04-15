
# Zepmeds Emergency Services - Dashboard Integration

This document outlines how the Zepmeds mobile app emergency services feature integrates with the Zepmeds Ambulance dashboard.

## Integration Overview

When a user requests emergency services through the mobile app:

1. The request is stored in the Supabase `emergency_requests` table
2. Data is sent to the Zepmeds Ambulance dashboard via:
   - Direct API call to the dashboard endpoint
   - Real-time database synchronization through Supabase Realtime

## Database Schema

The integration uses three main tables:

1. `emergency_requests`: Stores all emergency service requests from users
2. `emergency_responders`: Information about emergency service responders
3. `emergency_assignments`: Links emergency requests to responders

For complete details of the schema, see `src/schemas/emergency-services-schema.json`.

## Setup Instructions

### 1. Create Supabase Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create emergency_requests table
CREATE TABLE emergency_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  request_type TEXT NOT NULL,
  status TEXT NOT NULL,
  location_lat FLOAT,
  location_lng FLOAT,
  address TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emergency_responders table
CREATE TABLE emergency_responders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  vehicle_number TEXT,
  phone_number TEXT,
  status TEXT NOT NULL,
  location_lat FLOAT,
  location_lng FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emergency_assignments table
CREATE TABLE emergency_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emergency_request_id UUID REFERENCES emergency_requests(id),
  responder_id UUID REFERENCES emergency_responders(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  eta_minutes INTEGER,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Set up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_responders ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for emergency_requests
CREATE POLICY "Users can view their own requests" ON emergency_requests
  FOR SELECT USING (auth.uid()::text = user_id);
  
CREATE POLICY "Users can create requests" ON emergency_requests
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
  
CREATE POLICY "Users can update their own requests" ON emergency_requests
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Create admin user table for dashboard access
CREATE TABLE admin_users (
  user_id TEXT PRIMARY KEY
);

-- Add admin policies
CREATE POLICY "Admins can view all requests" ON emergency_requests
  FOR SELECT USING (auth.uid()::text IN (SELECT user_id FROM admin_users));
  
CREATE POLICY "Admins can update all requests" ON emergency_requests
  FOR UPDATE USING (auth.uid()::text IN (SELECT user_id FROM admin_users));

-- Similar policies for emergency_responders and emergency_assignments
-- (Add these based on the schema defined in emergency-services-schema.json)
```

### 3. Set Up Supabase Environment Variables

In your application:

1. Update the Supabase URL and anon key in `src/lib/supabase.ts`
2. Add the Zepmeds dashboard API endpoint and authentication in `src/services/emergencyService.ts`

### 4. Setting Up Real-time Sync with Dashboard

To enable real-time updates, configure your Zepmeds dashboard to subscribe to Supabase Realtime events:

```js
// In the dashboard application
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

supabase
  .channel('emergency_events')
  .on('INSERT', { event: 'INSERT', schema: 'public', table: 'emergency_requests' }, 
    payload => handleNewEmergencyRequest(payload.new))
  .on('UPDATE', { event: 'UPDATE', schema: 'public', table: 'emergency_requests' }, 
    payload => handleUpdatedEmergencyRequest(payload.new, payload.old))
  .subscribe()
```

## Security Considerations

1. Use proper authentication for all API calls
2. Ensure RLS policies are correctly implemented
3. Sanitize all user input before storing in database
4. Use HTTPS for all API communication
5. Regularly audit access logs

## Data Flow Diagram

```
User App                                     Zepmeds Dashboard
   |                                                |
   | Request Emergency                              |
   | Services                                       |
   |---------------------> Supabase DB <------------|
                              |                     |
                              | Real-time events    |
                              |-------------------->|
                              |                     |
                              | Direct API call     |
                              |-------------------->|
                                                    |
                                                    | Display and assign
                                                    | emergency services
```

## Testing the Integration

1. Make a test emergency request from the mobile app
2. Verify data is received in the dashboard
3. Test responder assignment from dashboard
4. Verify status updates appear in mobile app
