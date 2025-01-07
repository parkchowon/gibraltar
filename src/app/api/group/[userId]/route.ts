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

  try {
    const { data, error } = await supabase
      .from("participant_group")
      .insert({ group_id: groupId, participant_user_id: userId });

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { message: "데이터 저장 성공", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류" }, { status: 500 });
  }
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();
  const userId = params.userId;
  try {
    const { data: groupData, error: groupError } = await supabase
      .from("group")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (groupError) throw new Error(groupError.message);

    if (groupData) {
      const { data, error } = await supabase
        .from("participant_group")
        .select("participant_user_id, users(profile_url, nickname, handle)")
        .eq("group_id", groupData.id);
      if (error) throw new Error(error.message);
      return NextResponse.json({ data, status: "모집" });
    } else {
      const { data, error } = await supabase
        .from("participant_group")
        .select("*")
        .eq("participant_user_id", userId)
        .single();
      if (error) throw new Error(error.message);
      if (data) return NextResponse.json({ status: "참가" });
    }

    return NextResponse.json({ status: "안함" });
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류" }, { status: 500 });
  }
};
