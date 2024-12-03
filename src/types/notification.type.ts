import { PostType } from "./home.type";

export type NotificationType = {
  type: string | undefined;
  created_at: string;
  id: string;
  is_read: boolean;
  mentioned_post_id: string | null;
  reacted_user_id: string;
  related_post_id: string | null;
  user_id: string;
  reacted_user: {
    nickname: string;
    profile_url: string;
    handle: string;
  } | null;
  related_post: {
    content: string;
  } | null;
  comment: PostType | null;
  quote: PostType | null;
};
