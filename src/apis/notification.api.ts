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

    // 댓글 post id 배열
    const typeCommentIds = data
      .filter((data) => data.type === "comment")
      .map((comment) => comment.mentioned_post_id);

    // 인용 포스트의 id 배열
    const typeQuoteIds = data
      .filter((data) => (data.type = "quote"))
      .map((quote) => quote.mentioned_post_id);

    const commentPostsResults = await Promise.allSettled(
      typeCommentIds.map(fetchPostDetail)
    );

    const quotePostsResults = await Promise.all(
      typeQuoteIds.map(fetchPostDetail)
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
      // TODO: 로직에 오류있음!
      const quote =
        noti.type === "quote"
          ? quotePostsResults.find(
              (quote) => quote?.id === noti.mentioned_post_id
            )
          : null;

      return {
        ...noti,
        comment: comment,
        quote: quote,
      };
    });
    return notiWithPost;
  } catch (error) {
    console.error(error);
    return [];
  }
};
