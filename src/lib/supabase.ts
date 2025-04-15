
import { createClient } from '@supabase/supabase-js';

// Use the provided values directly
const supabaseUrl = 'https://lpcpjrjhqqfjjhccawkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwY3BqcmpocXFmampoY2Nhd2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTA3OTcsImV4cCI6MjA1OTc4Njc5N30.LPJEJ257e_K14BPbmNuZ9xDbjI68vh-iOx_CEhz3lVQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Import the dashboard API service
import { getDashboardApiService } from '@/services/dashboardApiService';

// Export the dashboard API service for use in components
export const dashboardApiService = getDashboardApiService();
