import { fetchPostDetail } from "@/apis/post.api";
import { NOTIFICATION_SIZE } from "@/constants/post";
import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();

  const { reacted_user_id, type, user_id, mentioned_post_id, related_post_id } =
    await request.json();

  try {
    if (user_id !== reacted_user_id) {
      const { data, error } = await supabase.from("notifications").insert({
        reacted_user_id,
        user_id,
        type,
        is_read: false,
        mentioned_post_id,
        related_post_id,
      });

      if (error) throw new Error(error.message);

      return NextResponse.json({ message: "알림 저장 성공" }, { status: 200 });
    }
    return NextResponse.json({ message: "자신의 포스트에는 알림 x" });
  } catch (error) {
    return NextResponse.json(
      { message: "알림 저장 중 서버오류로 실패", error },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") as string;
  const queryCursor = searchParams.get("cursor") as string;
  const cursor = queryCursor.split(" ").join("+");
  try {
    let notificationQuery = supabase
      .from("notifications")
      .select(
        "*,reacted_user:users!notifications_reacted_user_id_fkey(nickname, profile_url, handle), related_post:posts!notifications_related_post_id_fkey(content)"
      )
      .eq("user_id", userId)
      .neq("reacted_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(NOTIFICATION_SIZE);
    if (cursor) {
      notificationQuery = notificationQuery.lt("created_at", cursor);
    }
    const { data, error } = await notificationQuery;
    if (error) {
      throw new Error(error.message);
    }

    // 왜인지 모르겠는데 위 notifications 테이블 query에서 type이 quote으로 중복되는 문제가 생겨서 만든 query..
    const { data: typeData, error: typeError } = await supabase
      .from("notifications")
      .select("id, type")
      .eq("user_id", userId);

    if (typeError) {
      throw new Error(typeError.message);
    }

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

    return NextResponse.json(combinedNoti);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") as string;

  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { message: "알림 읽음 업데이트 성공", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;

  const relatedPostId = searchParams.get("related_post_id") as string;
  const mentionedPostId = searchParams.get("mentioned_post_id") as string;
  const reactedUserId = searchParams.get("reacted_user_id") as string;
  const userId = searchParams.get("user_id") as string;
  const type = searchParams.get("type") as string;

  let query = supabase
    .from("notifications")
    .delete()
    .eq("reacted_user_id", reactedUserId)
    .eq("type", type);

  if (relatedPostId) {
    query = query.eq("related_post_id", relatedPostId);
  }

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (mentionedPostId) {
    query = query.eq("mentioned_post_id", mentionedPostId);
  }

  try {
    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "notification 테이블 저장 성공" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "notification 테이블 삭제 중 서버 오류", error },
      { status: 500 }
    );
  }
};
