import supabase from "@/supabase/client";
import { fetchPostDetail } from "./post.api";
import { PostType } from "@/types/home.type";

export const getNotification = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc(
      "get_notifications_with_details",
      {
        p_user_id: userId,
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

    console.log(commentPostsMap);
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
