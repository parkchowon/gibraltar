import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const { reacted_user_id, type, user_id, mentioned_post_id, related_post_id } =
    await request.json();

  try {
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
  } catch (error) {
    return NextResponse.json(
      { message: "알림 저장 중 서버오류로 실패", error },
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
