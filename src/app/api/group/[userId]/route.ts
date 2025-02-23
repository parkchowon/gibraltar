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
  const position = searchParams.get("position") as string;

  try {
    const { data, error } = await supabase.from("participant_group").upsert(
      {
        group_id: groupId,
        participant_user_id: userId,
        participant_status: "참가 중",
        party_position: position,
      },
      { onConflict: "participant_user_id" }
    );

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
    if (groupError && groupError.code !== "PGRST116")
      throw new Error(groupError.message);

    if (groupData) {
      const { data, error } = await supabase
        .from("participant_group")
        .select(
          "group_id, participant_user_id, participant_status, party_position,users(id, profile_url, nickname, handle)"
        )
        .eq("group_id", groupData.id);
      if (error) throw new Error(error.message);

      return NextResponse.json({
        data,
        group: {
          id: groupData.id,
          group_status: groupData.group_status,
          position: groupData.position,
        },
        status: "모집",
      });
    } else {
      const { data, error } = await supabase
        .from("participant_group")
        .select("*, group(title, mode, group_status, battle_tag)")
        .eq("participant_user_id", userId)
        .neq("participant_status", "거절");

      if (error && error.code !== "PGRST116") throw new Error(error.message);

      if (data && data.length > 0)
        return NextResponse.json({ data, status: "참가" });
      const { data: rejectData, error: rejectError } = await supabase
        .from("participant_group")
        .select("*, group(title, mode, group_status)")
        .eq("participant_status", "거절");
      if (rejectError && rejectError.code !== "PGRST116")
        throw new Error(rejectError.message);
      return NextResponse.json({ data: rejectData, status: "안함" });
    }
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류" }, { status: 500 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const userId = params.userId;
  const groupId = searchParams.get("group_id") as string;

  try {
    const { data, error } = await supabase
      .from("group")
      .delete()
      .eq("id", groupId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류" }, { status: 500 });
  }
};
