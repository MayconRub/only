import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
  try {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  } catch {
    return false;
  }
};

// Use placeholders if keys are missing to prevent app crash
const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-project.supabase.co';
const finalKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);

export const testSupabaseConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    return { success: false, message: 'Missing or invalid Supabase credentials' };
  }
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection error:', error.message);
      return { success: false, message: error.message };
    }
    console.log('Successfully connected to Supabase!');
    return { success: true, message: 'Connected' };
  } catch (err) {
    console.error('Unexpected error connecting to Supabase:', err);
    return { success: false, message: 'Unexpected error' };
  }
};
