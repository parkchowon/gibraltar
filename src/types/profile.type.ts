import { Json } from "./supabase";

export type FollowType = {
  created_at: string;
  follower_id: string;
  following_id: string;
  id: number;
}[];

export type RecommendedUserType =
  | {
      user: {
        id: string;
        nickname: string;
        profile_url: string;
        handle: string;
        profile: {
          bio: string;
          play_style: string;
          play_mode: Json;
          play_time: Json;
          favorite_team: string;
        };
      };
      isFollowing: boolean;
      score?: number;
    }[]
  | null;
