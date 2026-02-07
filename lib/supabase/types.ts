// This file will contain your database types
// You can generate these automatically using Supabase CLI:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts

// Example type structure (replace with your actual database schema):
export interface Database {
  public: {
    Tables: {
      // Add your table types here
      // Example:
      // users: {
      //   Row: {
      //     id: string;
      //     email: string;
      //     created_at: string;
      //   };
      //   Insert: {
      //     id?: string;
      //     email: string;
      //     created_at?: string;
      //   };
      //   Update: {
      //     id?: string;
      //     email?: string;
      //     created_at?: string;
      //   };
      // };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
