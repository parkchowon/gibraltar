import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json({ message: "userId가 없음" }, { status: 400 });
  }
  try {
    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_deleted", false);
    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(count || 0);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
