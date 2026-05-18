import { createClient } from '@supabase/supabase-js';

// KITA TEMBAK LANGSUNG KUNCINYA DI SINI BIAR SERVERNYA NGGAK ALASAN LAGI!
const supabaseUrl = 'https://cohuunitexjqomkuqxiw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvaHV1bml0ZXhqcW9ta3VxeGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzQwNzYsImV4cCI6MjA5NDY1MDA3Nn0.EIEATmn799xuCng0yONuNwIsrEliYX7BxJgYvQvX5R4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);