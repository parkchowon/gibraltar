import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();
  const userId = params.userId;
  const followingId = request.nextUrl.searchParams.get(
    "following-id"
  ) as string;
  try {
    const { data, error } = await supabase
      .from("followers")
      .insert({ follower_id: userId, following_id: followingId });

    if (error) throw new Error(error.message);

    const { data: notiData, error: notiError } = await supabase
      .from("notifications")
      .insert({
        reacted_user_id: userId,
        user_id: followingId,
        type: "follow",
        is_read: false,
      });
    if (notiError) throw new Error(notiError.message);

    return NextResponse.json({ message: "팔로우 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();
  const userId = params.userId;
  const followingId = request.nextUrl.searchParams.get(
    "following-id"
  ) as string;

  try {
    const { data, error } = await supabase
      .from("followers")
      .delete()
      .eq("follower_id", userId)
      .eq("following_id", followingId);

    if (error) throw new Error(error.message);

    const { data: notiData, error: notiError } = await supabase
      .from("notifications")
      .delete()
      .eq("type", "follow")
      .eq("reacted_user_id", userId)
      .eq("user_id", followingId);
    if (notiError) throw new Error(notiError.message);

    return NextResponse.json({ message: "언팔로우 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
