import supabase from "@/supabase/client";
import { fetchPostDetail } from "./post.api";
import { PostType } from "@/types/home.type";

const NOTIFICATION_SIZE = 20;

export const getNotification = async (userId: string, cursor: string) => {
  try {
    let notificationQuery = supabase
      .from("notifications")
      .select(
        "*,reacted_user:users!notifications_reacted_user_id_fkey(nickname, profile_url), related_post:posts!notifications_related_post_id_fkey(content)"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(NOTIFICATION_SIZE);
    if (cursor) {
      notificationQuery = notificationQuery.lt("created_at", cursor);
    }
    const { data, error } = await notificationQuery;

    // 왜인지 모르겠는데 위 notifications 테이블 query에서 type이 quote으로 중복되는 문제가 생겨서 만든 query..
    const { data: typeData, error: typeError } = await supabase
      .from("notifications")
      .select("id, type")
      .eq("user_id", userId);
    if (error) {
      throw new Error(error.message);
    }

    // TODO: 댓글이랑 인용에 필요한 데이터 받아오기
    const noti = data.map((noti) => {
      const matchType = typeData?.find((type) => type.id === noti.id)?.type;
      return { ...noti, type: matchType };
    });
    console.log(typeData);

    const typeCommentIds = noti
      .filter((data) => data.type === "comment")
      .map((comment) => comment.mentioned_post_id)
      .filter((item) => item !== null);

    const commentResult = await Promise.all(
      typeCommentIds.map(fetchPostDetail)
    );

    const typeQuoteIds = noti
      .filter((data) => data.type === "quote")
      .map((quote) => quote.mentioned_post_id)
      .filter((item) => item !== null);

    console.log(typeQuoteIds);

    const quoteResult = await Promise.all(typeQuoteIds.map(fetchPostDetail));

    const combinedNoti = noti.map((noti) => {
      let comment = null;
      let quote = null;

      const matchType = typeData?.find((type) => type.id === noti.id)?.type;

      if (noti.type === "comment") {
        comment =
          commentResult.find(
            (comment) => comment?.id === noti.mentioned_post_id
          ) || null;
      }
      if (noti.type === "quote") {
        quote =
          quoteResult.find((quote) => quote?.id === noti.mentioned_post_id) ||
          null;
      }

      return {
        ...noti,
        type: matchType,
        comment: comment,
        quote: quote,
      };
    });

    return combinedNoti;
  } catch (error) {
    console.error(error);
    return [];
  }
};
// export const getNotification = async (userId: string, pageParam: string) => {
//   try {
//     const { data, error } = await supabase.rpc(
//       "get_notifications_with_details",
//       {
//         p_user_id: userId,
//         p_notification_size: NOTIFICATION_SIZE,
//         p_cursor: pageParam,
//       }
//     );
//     console.log(data);

//     if (error) throw new Error(error.message);

//     // 댓글 post id 배열
//     const typeCommentIds = data
//       .filter((data) => data.type === "comment")
//       .map((comment) => comment.mentioned_post_id)
//       .filter((item) => item !== null);

//     // 인용 포스트의 id 배열
//     const typeQuoteIds = data
//       .filter((data) => (data.type = "quote"))
//       .map((quote) => quote.mentioned_post_id)
//       .filter((item) => item !== null);

//     console.log(typeQuoteIds);

//     const commentPostsResults = await Promise.allSettled(
//       typeCommentIds.map(fetchPostDetail)
//     );

//     const quotePostsResults = await Promise.allSettled(
//       typeQuoteIds.map((quote) => fetchPostDetail(quote))
//     );

//     const commentPosts = commentPostsResults
//       .filter(
//         (result): result is PromiseFulfilledResult<NonNullable<PostType>> =>
//           result.status === "fulfilled" && result.value !== undefined
//       )
//       .map((result) => result.value);

//     const commentPostsMap = new Map(
//       commentPosts.map((post) => [post?.id, post])
//     );

//     const quotePosts = quotePostsResults
//       .filter(
//         (result): result is PromiseFulfilledResult<NonNullable<PostType>> =>
//           result.status === "fulfilled" && result.value !== undefined
//       )
//       .map((result) => result.value);

//     const quotePostsMap = new Map(quotePosts.map((post) => [post.id, post]));
//     const notiWithPost = data.map((noti) => {
//       const comment =
//         noti.type === "comment"
//           ? commentPostsMap.get(noti.mentioned_post_id) || null
//           : null;
//       // TODO: 로직에 오류있음!
//       const quote =
//         noti.type === "quote"
//           ? quotePostsMap.get(noti.mentioned_post_id) || null
//           : null;

//       return {
//         ...noti,
//         comment: comment,
//         quote: quote,
//       };
//     });
//     return notiWithPost;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };
