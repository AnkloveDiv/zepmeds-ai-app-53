
-- Zepmeds Emergency Services Database Schema
-- This file contains the SQL commands to set up the database schema
-- for the emergency services feature in the Zepmeds app

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create emergency_requests table
CREATE TABLE IF NOT EXISTS emergency_requests (
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
CREATE TABLE IF NOT EXISTS emergency_responders (
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
CREATE TABLE IF NOT EXISTS emergency_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emergency_request_id UUID REFERENCES emergency_requests(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES emergency_responders(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  eta_minutes INTEGER,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table for dashboard access
CREATE TABLE IF NOT EXISTS admin_users (
  user_id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a table to track emergency response metrics
CREATE TABLE IF NOT EXISTS emergency_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emergency_request_id UUID REFERENCES emergency_requests(id) ON DELETE CASCADE,
  requested_at TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ,
  arrived_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  response_time_seconds INTEGER,
  travel_time_seconds INTEGER,
  total_time_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track user health information for emergencies
CREATE TABLE IF NOT EXISTS user_health_profiles (
  user_id TEXT PRIMARY KEY,
  blood_type TEXT,
  allergies TEXT[],
  medical_conditions TEXT[],
  emergency_contacts JSONB,
  medications TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_responders ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_health_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for emergency_requests
CREATE POLICY "Users can view their own requests"
ON emergency_requests FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create requests"
ON emergency_requests FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own requests"
ON emergency_requests FOR UPDATE
USING (auth.uid()::text = user_id);

CREATE POLICY "Admins can view all requests"
ON emergency_requests FOR SELECT
USING (auth.uid()::text IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can update all requests"
ON emergency_requests FOR UPDATE
USING (auth.uid()::text IN (SELECT user_id FROM admin_users));

-- Create RLS policies for user_health_profiles
CREATE POLICY "Users can view their own health profile"
ON user_health_profiles FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own health profile"
ON user_health_profiles FOR UPDATE
USING (auth.uid()::text = user_id);

CREATE POLICY "Admins can view all health profiles"
ON user_health_profiles FOR SELECT
USING (auth.uid()::text IN (SELECT user_id FROM admin_users));

-- Add similar policies for other tables as needed

-- Function to update timestamps on record changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_emergency_requests_updated_at
BEFORE UPDATE ON emergency_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_responders_updated_at
BEFORE UPDATE ON emergency_responders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_assignments_updated_at
BEFORE UPDATE ON emergency_assignments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_metrics_updated_at
BEFORE UPDATE ON emergency_metrics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_health_profiles_updated_at
BEFORE UPDATE ON user_health_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create emergency metrics record when a request is created
CREATE OR REPLACE FUNCTION create_emergency_metrics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO emergency_metrics (emergency_request_id, requested_at, created_at, updated_at)
    VALUES (NEW.id, NEW.created_at, NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create metrics record
CREATE TRIGGER on_emergency_request_created
AFTER INSERT ON emergency_requests
FOR EACH ROW EXECUTE FUNCTION create_emergency_metrics();

-- Function to update emergency metrics when status changes
CREATE OR REPLACE FUNCTION update_emergency_metrics()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'dispatched' AND OLD.status != 'dispatched' THEN
        UPDATE emergency_metrics 
        SET dispatched_at = NEW.updated_at 
        WHERE emergency_request_id = NEW.id;
    ELSIF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE emergency_metrics 
        SET 
            completed_at = NEW.updated_at,
            total_time_seconds = EXTRACT(EPOCH FROM (NEW.updated_at - (SELECT requested_at FROM emergency_metrics WHERE emergency_request_id = NEW.id)))::INTEGER
        WHERE emergency_request_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update metrics
CREATE TRIGGER on_emergency_request_updated
AFTER UPDATE ON emergency_requests
FOR EACH ROW EXECUTE FUNCTION update_emergency_metrics();
