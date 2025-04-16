
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://selkrzzcwbyyawcuwlpa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbGtyenpjd2J5eWF3Y3V3bHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODY2OTcsImV4cCI6MjA2MDM2MjY5N30.firDGbV2MsFOj9ZmN8vO2oAztPBQ2m0GBKE7jxtrxKA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
