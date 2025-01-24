import { UserRow } from "./database";
import { Json } from "./supabase";

// User데이터를 supabase에서 받을 때
export type UserDataProps = {
  userData: UserRow | undefined | null;
  isPending?: boolean;
};

/** Post를 다룰 때, 배열과 개별 post 타입 */

export type PostsType = PostType[] | null;

// post 컴포넌트에서 사용되는 type
export type PostType = {
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
    account_type: string;
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
};

export type QuoteType = {
  user: {
    id: string;
    nickname: string;
    handle: string;
    profile_url: string;
  } | null;
  content: string;
  images: Json;
  created_at: string;
  is_deleted: boolean;
} | null;

export type CreatePostType = {
  content: string;
  images: File[] | null;
  parent_post_id: string | null;
  parent_user_id?: string;
  quoted_post_id?: string | null;
  user_id: string;
};

export type CreateQuoteType = {
  content: string;
  images: File[] | null;
  parent_post_id: string | null;
  quoted_post_id: string | null;
  post_user_id: string;
  user_id: string;
};

export type deletePostType = {
  postId: string;
  userId: string; //post의 userId
};

type Tag = {
  tag_name: string;
};

type PostTags = {
  tag: Tag | null;
};

// supabase reposts, notifications 테이블 추가, 삭제 로직 매개변수 타입
export type RepostFnType = {
  postId: string;
  userId: string | undefined;
  postUserId: string;
};

// supabase likes, notifications 테이블 추가, 삭제 로직 매개변수 타입
export type LikesFnType = {
  postId: string;
  userId?: string | null;
  postUserId: string;
  state?: boolean;
};

export type CommentInsertProps = {
  comment: string;
  postId: string;
  userId: string;
  parentId?: string;
};
