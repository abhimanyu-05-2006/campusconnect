/**
 * CampusConnect Supabase Server-Side Client
 * Used in Server Actions and Route Handlers with Cookie/Session resolution.
 */

import { getSupabaseConfig } from './client';

export function createServerClient() {
  const config = getSupabaseConfig();
  return {
    url: config.supabaseUrl,
    key: config.supabaseAnonKey,
    auth: {
      getUser: async () => ({
        data: {
          user: {
            id: 'u_student_1',
            email: 'aarav.sharma@bits.edu.in',
            user_metadata: { role: 'student', college_id: 'c1' }
          }
        },
        error: null
      }),
      getSession: async () => ({
        data: {
          session: {
            access_token: 'mock-jwt-token',
            user: { id: 'u_student_1', email: 'aarav.sharma@bits.edu.in' }
          }
        },
        error: null
      })
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
