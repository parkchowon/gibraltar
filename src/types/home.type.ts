import { getPost } from "@/apis/post.api";
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
export type PostType = Awaited<ReturnType<typeof getPost>>[number];

export type CreatePostType = {
  content: string;
  images: File[] | null;
  parent_post_id: string | null;
  user_id: string;
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
