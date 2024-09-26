import { Database } from "./supabase";

export type TagRow = Database["public"]["Tables"]["tags"]["Row"];
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type PostRow = Database['public']['Tables']['posts']['Row'];
export type PostType = Omit<PostRow, 'created_at'|'id'>