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
