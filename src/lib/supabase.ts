import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** false quando o .env.local não existe: o app mostra um aviso em vez de quebrar. */
export const isSupabaseConfigured = Boolean(url && key);

// Só a chave publishable vai para o navegador. A segurança vem do RLS no banco.
export const supabase = createClient<Database>(url ?? 'http://localhost', key ?? 'missing', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
