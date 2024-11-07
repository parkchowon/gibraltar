import supabase from "@/supabase/client";
import { fetchPostDetail } from "./post.api";
import { PostType } from "@/types/home.type";

const NOTIFICATION_SIZE = 20;

export const getNotification = async (userId: string, pageParam: string) => {
  try {
    const { data, error } = await supabase.rpc(
      "get_notifications_with_details",
      {
        p_user_id: userId,
        p_notification_size: NOTIFICATION_SIZE,
        p_cursor: pageParam,
      }
    );

    if (error) throw new Error(error.message);

    const typeCommentId = data
      .filter((data) => data.type === "comment")
      .map((comment) => comment.mentioned_post_id);

    const commentPostsResults = await Promise.allSettled(
      typeCommentId.map(fetchPostDetail)
    );

    const commentPosts = commentPostsResults
      .filter(
        (result): result is PromiseFulfilledResult<NonNullable<PostType>> =>
          result.status === "fulfilled" && result.value !== undefined
      )
      .map((result) => result.value);

    const commentPostsMap = new Map(
      commentPosts.map((post) => [post?.id, post])
    );

    const notiWithPost = data.map((noti) => {
      const comment =
        noti.type === "comment"
          ? commentPostsMap.get(noti.mentioned_post_id) || null
          : null;
      return {
        ...noti,
        isComment: noti.type === "comment",
        comment: comment,
      };
    });
    return notiWithPost;
  } catch (error) {
    console.error(error);
    return [];
  }
};
