import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError)
      return NextResponse.json(
        { message: "유저 정보 찾는 중 오류" },
        { status: 401 }
      );
    if (!user) {
      return NextResponse.json(
        { message: "유저가 확인되지 않습니다" },
        { status: 400 }
      );
    }
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error)
      return NextResponse.json(
        { message: "회원 삭제 중 오류 발생" },
        { status: 402 }
      );

    return NextResponse.json({ message: "회원 탈퇴 성공" });
  } catch (error) {
    return NextResponse.json(
      { message: "회원 탈퇴 오류", error },
      { status: 500 }
    );
  }
};
