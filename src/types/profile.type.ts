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

export type UserProfileType = {
  created_at: string;
  email: string;
  handle: string;
  id: string;
  nickname: string;
  profile_url: string;
  status: string | null;
  detail: {
    bio: string;
  } | null;
};

export type ProfileType = {
  userId: string;
  bio?: string;
  playStyle?: {
    mode?: string[];
    style: string | null;
    time?: string[];
  };
  mainChamps?: {
    key: string;
    name: string;
    portrait: string;
    role: "tank" | "damage" | "support";
  }[];
  playChamps?: {
    key: string;
    name: string;
    portrait: string;
    role: "tank" | "damage" | "support";
  }[];
  favoriteTeam?: string | null;
  tier?: string[];
  grade?: number[];
};

export type ProfileProps = {
  nickname?: string;
  handle?: string;
  file?: File;
  userId: string;
};
