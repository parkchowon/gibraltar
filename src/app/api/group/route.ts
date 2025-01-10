import { POST_SIZE } from "@/constants/post";
import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const {
      userId,
      title,
      content,
      battle_tag,
      mode,
      position,
      tier,
      style,
      mic,
    } = await request.json();

    const { data, error } = await supabase
      .from("group")
      .insert({
        user_id: userId,
        title,
        content,
        battle_tag,
        mode,
        position,
        tier,
        style,
        mic,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ message: "group 저장 성공", postId: data.id });
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류", status: 500 });
  }
};

export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const pageParams = Number(searchParams.get("cursor") as string);
  const userId = searchParams.get("user_id") as string;

  try {
    const start = (pageParams - 1) * POST_SIZE;
    const end = pageParams * POST_SIZE - 1;

    const { data, error } = await supabase
      .from("group")
      .select("*")
      .range(start, end)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const groupId = data.map((data) => data.id);

    const participantUsers = await Promise.all(
      groupId.map(async (id) => {
        const { count, error } = await supabase
          .from("participant_group")
          .select("*", { count: "exact", head: true })
          .eq("group_id", id)
          .eq("participant_status", "승인");
        if (error) {
          Error(error.message);
          return { id, count: 0 };
        }
        return { id, count };
      })
    );

    const result = data.map((data) => {
      const count =
        participantUsers.find((user) => user.id === data.id)?.count ?? 0;
      return { ...data, participant_count: count };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류", status: 500 });
  }
};
