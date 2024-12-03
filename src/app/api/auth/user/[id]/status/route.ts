import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const { status } = await request.json();

  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ message: "userId가 없음" }, { status: 400 });
  }
  if (!status) {
    return NextResponse.json(
      { message: "status가 제공되지 않았습니다." },
      { status: 400 }
    );
  }
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ status: status })
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(
      { message: "status 업데이트 성공", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
