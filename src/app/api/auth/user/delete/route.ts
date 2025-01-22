import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { message: "유저가 확인되지 않습니다" },
        { status: 400 }
      );
    }
    const { error } = await supabase.auth.admin.deleteUser(session.user.id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "회원 탈퇴 성공" });
  } catch (error) {
    return NextResponse.json({ message: "회원 탈퇴 오류" }, { status: 500 });
  }
};
