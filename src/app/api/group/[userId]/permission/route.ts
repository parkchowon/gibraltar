import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const userId = params.userId;
  const groupId = searchParams.get("group_id") as string;
  const status = searchParams.get("status") as string;

  try {
    const { data, error } = await supabase
      .from("participant_group")
      .update({ participant_status: status })
      .eq("group_id", groupId)
      .eq("participant_user_id", userId);
    if (error) throw new Error(error.message);
    return NextResponse.json(
      { message: "업데이트 성공", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류" }, { status: 500 });
  }
};
