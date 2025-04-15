import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Import the dashboard API service
import { getDashboardApiService } from '@/services/dashboardApiService';

// Export the dashboard API service for use in components
export const dashboardApiService = getDashboardApiService();
