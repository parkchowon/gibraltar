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
  reposts: {
    post_id: string;
    comment: string | null;
    reposted_by: string;
    reposted_at: string;
  }[] | undefined;
  likes: {
    post_id: string;
    user_id: string;
  }[] | undefined;
  comments: {
    comment: string;
    created_at: string;
    id: string;
    parent_comment_id: string | null;
    post_id: string;
    user_id: string;
  }[] | undefined;
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

export type PostSingleType = {
  reposts: {
    post_id: string;
    comment: string | null;
    reposted_by: string;
    reposted_at: string;
  }[] | null;
  likes: {
    post_id: string;
    user_id: string;
  }[] | null;
  comments: {
    comment: string;
    created_at: string;
    id: string;
    parent_comment_id: string | null;
    post_id: string;
    user_id: string;
  }[] | null;
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

export type LikesFnType = {
  postId: string;
  userId?: string | null;
  state?: boolean;
}