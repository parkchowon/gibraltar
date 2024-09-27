import { UserRow } from "./database";
import { Json } from "./supabase";

// User데이터를 supabase에서 받을 때
export type UserDataProps = {
  userData: UserRow | undefined | null;
  isPending?: boolean;
};

/** Post를 다룰 때, 배열과 개별 post 타입 */

export type PostsType = PostType[] | null;

export type PostType = {
  content: string;
  created_at: string;
  id: string;
  images: Json | null;
  user_id: string;
  user: {
    handle: string;
    nickname: string;
    profile_url: string;
  } | null;
  post_tags: {
    tag: { 
      tag_name: string;
    } | null
  }[]
};

type Tag = {
  tag_name: string;
}

type PostTags = {
  tag: Tag | null;
}
