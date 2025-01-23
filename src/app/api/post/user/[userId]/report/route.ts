import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const reason = searchParams.get("reason") as string;
  const postId = searchParams.get("post_id") as string;
  const userId = params.userId;

  try {
    console.log(userId, postId, reason);
    const { data, error } = await supabase
      .from("reports")
      .insert({ user_id: userId, post_id: postId, reason: reason });
    if (error) throw new Error(error.message);
    return NextResponse.json(
      { message: "신고 저장 완료", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류" }, { status: 500 });
  }
};
