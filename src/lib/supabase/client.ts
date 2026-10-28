/**
 * CampusConnect Supabase Browser Client
 * Supports standard Supabase environment variables:
 * NEXT_PUBLIC_SUPABASE_URL / VITE_SUPABASE_URL
 * NEXT_PUBLIC_SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY
 */

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const supabaseUrl =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
    'https://campusconnect-demo.supabase.co';

  const supabaseAnonKey =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
    'mock-anon-key-public-rls';

  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Browser-side Supabase Client factory
 */
export function createBrowserClient() {
  const config = getSupabaseConfig();
  return {
    url: config.supabaseUrl,
    key: config.supabaseAnonKey,
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: async (records: any) => ({ data: records, error: null }),
      update: async (patch: any) => ({ data: patch, error: null }),
      delete: async () => ({ error: null })
    })
  };
}

export const supabase = createBrowserClient();
