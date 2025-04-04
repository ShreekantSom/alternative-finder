
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jomeyunpmftiayhtlitn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbWV5dW5wbWZ0aWF5aHRsaXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODU2MzYsImV4cCI6MjA1OTM2MTYzNn0.eV4YKNwMxX8jNPFoDQnTS1Obh_XgmeQtbkhEs5k9PQY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
