import { Database } from "./supabase";

export type TagRow = Database["public"]["Tables"]["tags"]["Row"];
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
export type PostType = Omit<PostRow, "created_at" | "id">;
export type RepostType = Database["public"]["Tables"]["reposts"]["Insert"];
export type ProfileDetailType =
  Database["public"]["Tables"]["user_profiles"]["Row"];
