export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: number
        }
        Insert: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: number
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group: {
        Row: {
          battle_tag: string
          content: string
          created_at: string
          group_status: string
          id: string
          mic: string | null
          mode: string
          position: Json[]
          style: string | null
          tier: Json[] | null
          title: string
          update_at: string | null
          user_id: string
        }
        Insert: {
          battle_tag?: string
          content: string
          created_at?: string
          group_status?: string
          id?: string
          mic?: string | null
          mode: string
          position: Json[]
          style?: string | null
          tier?: Json[] | null
          title: string
          update_at?: string | null
          user_id: string
        }
        Update: {
          battle_tag?: string
          content?: string
          created_at?: string
          group_status?: string
          id?: string
          mic?: string | null
          mode?: string
          position?: Json[]
          style?: string | null
          tier?: Json[] | null
          title?: string
          update_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: number
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          post_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          mentioned_post_id: string | null
          reacted_user_id: string
          related_post_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          mentioned_post_id?: string | null
          reacted_user_id: string
          related_post_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          mentioned_post_id?: string | null
          reacted_user_id?: string
          related_post_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_mentioned_post_id_fkey"
            columns: ["mentioned_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_reacted_user_id_fkey"
            columns: ["reacted_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_group: {
        Row: {
          created_at: string
          group_id: string
          id: string
          participant_status: string
          participant_user_id: string
          party_position: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          participant_status?: string
          participant_user_id: string
          party_position?: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          participant_status?: string
          participant_user_id?: string
          party_position?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_group_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_group_participant_user_id_fkey"
            columns: ["participant_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      play_modes: {
        Row: {
          created_at: string
          id: string
          play_mode: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          play_mode: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          play_mode?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "play_modes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      play_times: {
        Row: {
          created_at: string
          id: string
          play_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          play_time: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          play_time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "play_times_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          created_at: string
          id: string
          post_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          images: Json | null
          is_deleted: boolean
          parent_post_id: string | null
          quoted_post_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          images?: Json | null
          is_deleted?: boolean
          parent_post_id?: string | null
          quoted_post_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          images?: Json | null
          is_deleted?: boolean
          parent_post_id?: string | null
          quoted_post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_quoted_post_id_fkey"
            columns: ["quoted_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reposts: {
        Row: {
          id: number
          is_quoted: boolean
          post_id: string
          reposted_at: string
          reposted_by: string
        }
        Insert: {
          id?: number
          is_quoted?: boolean
          post_id: string
          reposted_at?: string
          reposted_by: string
        }
        Update: {
          id?: number
          is_quoted?: boolean
          post_id?: string
          reposted_at?: string
          reposted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "reposts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reposts_reposted_by_fkey"
            columns: ["reposted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          tag_name: string
        }
        Insert: {
          id?: string
          tag_name: string
        }
        Update: {
          id?: string
          tag_name?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          bio: string | null
          created_at: string
          favorite_team: string | null
          id: string
          main_champs: Json | null
          play_champs: Json | null
          play_mode: Json | null
          play_style: string | null
          play_time: Json | null
          tier: Json | null
          tier_grade: Json | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          favorite_team?: string | null
          id?: string
          main_champs?: Json | null
          play_champs?: Json | null
          play_mode?: Json | null
          play_style?: string | null
          play_time?: Json | null
          tier?: Json | null
          tier_grade?: Json | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          favorite_team?: string | null
          id?: string
          main_champs?: Json | null
          play_champs?: Json | null
          play_mode?: Json | null
          play_style?: string | null
          play_time?: Json | null
          tier?: Json | null
          tier_grade?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "play_styles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_type: string | null
          created_at: string
          email: string
          handle: string
          id: string
          nickname: string
          profile_url: string
          status: string | null
        }
        Insert: {
          account_type?: string | null
          created_at?: string
          email: string
          handle?: string
          id?: string
          nickname: string
          profile_url: string
          status?: string | null
        }
        Update: {
          account_type?: string | null
          created_at?: string
          email?: string
          handle?: string
          id?: string
          nickname?: string
          profile_url?: string
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_notifications_with_details: {
        Args: {
          p_user_id: string
          p_notification_size?: number
          p_cursor?: string
        }
        Returns: {
          id: string
          user_id: string
          reacted_user_id: string
          related_post_id: string
          created_at: string
          mentioned_post_id: string
          type: string
          is_read: boolean
          reacted_user_nickname: string
          reacted_user_profile_url: string
          related_post_content: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
