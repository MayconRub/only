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
  const maskedUrl = supabaseUrl ? `${supabaseUrl.substring(0, 12)}...${supabaseUrl.substring(supabaseUrl.length - 12)}` : 'N/A';
  
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    return { 
      success: false, 
      message: 'Configurações ausentes ou inválidas.',
      details: `URL: ${maskedUrl}`
    };
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    // Try a simple fetch to the REST endpoint first - more reliable for connectivity check
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok || response.status === 404 || response.status === 401) {
      // If we get any response from Supabase (even 401/404), the connection is alive
      console.log('Supabase API is reachable!');
      return { success: true, message: 'Connected' };
    }

    return { 
      success: false, 
      message: `Erro de resposta: ${response.status}`,
      details: `URL: ${maskedUrl}`
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout');
    
    return { 
      success: false, 
      message: isTimeout ? 'O servidor do Supabase não respondeu (Timeout). Tente novamente em 1 minuto.' : 'Erro de rede ou DNS.',
      details: `Erro: ${err.message} | URL: ${maskedUrl}`
    };
  }
};
