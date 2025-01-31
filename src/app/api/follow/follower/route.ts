import { POST_SIZE } from "@/constants/post";
import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  const handle = request.nextUrl.searchParams.get("handle") as string;
  const pageParams = Number(request.nextUrl.searchParams.get("page_param"));
  const start = (pageParams - 1) * POST_SIZE;
  const end = pageParams * POST_SIZE - 1;
  try {
    // 1. handle로 userId를 구하고
    const { data: userId, error: userIdError } = await supabase
      .from("users")
      .select("id")
      .eq("handle", handle)
      .single();
    if (userIdError) throw new Error(userIdError.message);

    // 2. userId에 해당하는 팔로 리스트의 followingIds를 가져와서
    const { data: followerIds, error: followerError } = await supabase
      .from("followers")
      .select("follower_id")
      .eq("following_id", userId.id)
      .range(start, end);
    if (followerError) throw new Error(followerError.message);

    // 3. user데이터를 받는다.
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, profile_url, nickname, handle, user_profiles(bio)")
      .in(
        "id",
        followerIds.map((id) => id.follower_id)
      );
    if (userError) throw new Error(userError.message);

    return NextResponse.json(userData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
