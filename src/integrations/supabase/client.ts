// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gyqqzlifilvjltyezscl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cXF6bGlmaWx2amx0eWV6c2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTkzMTcsImV4cCI6MjA1ODU5NTMxN30.vJ7_R4LOfnHMvm2SV6wEusQ5JiEN29g3BnoKqxdBfkk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);