import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const groupId = searchParams.get("group_id") as string;

  try {
    const { data, error } = await supabase
      .from("group")
      .update({ group_status: "모집 완료" })
      .eq("id", groupId);
    if (error) throw new Error(error.message);

    return NextResponse.json(
      { message: "데이터 저장 성공", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
