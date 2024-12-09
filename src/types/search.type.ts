import { fetchPopularSearch, fetchUserSearch } from "@/apis/search.api";
import { Json } from "./supabase";

export type SearchUserType = {
  id: string;
  profile_url: string;
  nickname: string;
  handle: string;
  user_profiles: {
    bio: string;
  } | null;
}[];

export type SearchPostType = {
  isReposted: boolean | undefined;
  reposted_by: string | null;
  timeline_at: string;
  comments: {
    content: string;
    created_at: string;
    id: string;
    images: Json | null;
    parent_post_id: string | null;
    quoted_post_id: string | null;
    user_id: string;
  }[];
  content: string;
  created_at: string;
  id: string;
  images: Json | null;
  parent_post_id: string | null;
  quoted_post_id: string | null;
  user_id: string;
  is_deleted: boolean;
  user: {
    id: string;
    nickname: string;
    profile_url: string;
    handle: string;
  } | null;
  post_tags: {
    tag: {
      tag_name: string;
    } | null;
  }[];
  reposts: {
    reposted_by: string;
    is_quoted: boolean;
  }[];
  likes: {
    user_id: string;
  }[];
}[];
