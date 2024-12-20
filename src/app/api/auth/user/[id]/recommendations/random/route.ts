import { createClient } from "@/supabase/server";
import { ProfileType } from "@/types/profile.type";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const profile = (await request.json()) as ProfileType;

  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, nickname, profile_url, handle, profile:user_profiles(bio, play_style, play_mode, play_time, favorite_team)"
      )
      .limit(5);
    if (error) {
      throw new Error(error.message);
    }
    if (data === null) {
      return NextResponse.json([]);
    }

    const randomId = data.map((user) => user.id);
    const { data: followResult, error: followError } = await supabase
      .from("followers")
      .select("*")
      .in("following_id", randomId)
      .eq("follower_id", profile.userId);
    if (followError) throw new Error(followError.message);

    const scoredUsers = data.map((user) => ({
      user: user,
      isFollowing:
        followResult?.length !== 0
          ? !!followResult?.find((follow) => {
              follow.follower_id === user.id;
            })?.id
          : false,
    }));

    return NextResponse.json(scoredUsers);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
