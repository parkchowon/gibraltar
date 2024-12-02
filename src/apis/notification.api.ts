import supabase from "@/supabase/client";
import { fetchPostDetail } from "./post.api";

const NOTIFICATION_SIZE = 20;

export const getNotification = async (userId: string, cursor: string) => {
  try {
    let notificationQuery = supabase
      .from("notifications")
      .select(
        "*,reacted_user:users!notifications_reacted_user_id_fkey(nickname, profile_url, handle), related_post:posts!notifications_related_post_id_fkey(content)"
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
