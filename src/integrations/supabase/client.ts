
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lpcpjrjhqqfjjhccawkf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwY3BqcmpocXFmampoY2Nhd2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTA3OTcsImV4cCI6MjA1OTc4Njc5N30.LPJEJ257e_K14BPbmNuZ9xDbjI68vh-iOx_CEhz3lVQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
