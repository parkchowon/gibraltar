import { createClient } from "@/supabase/server";
import { profileType } from "@/types/hero.type";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const profile = (await request.json()) as profileType;
  try {
    const { mode, style, time } = profile.playStyle;
    const playModes = profile.playStyle.mode.map((mode) => {
      return { user_id: profile.userId, play_mode: mode };
    });
    const playTime = profile.playStyle.time.map((time) => {
      return { user_id: profile.userId, play_time: time };
    });
    const [profileResult, modeResult, timeResult] = await Promise.all([
      supabase.from("user_profiles").insert({
        user_id: profile.userId,
        bio: profile.bio,
        favorite_team: profile.favoriteTeam,
        play_mode: mode,
        play_style: style,
        play_time: time,
        main_champs: profile.mainChamps,
        play_champs: profile.playChamps,
      }),
      supabase.from("play_modes").insert(playModes),
      supabase.from("play_times").insert(playTime),
    ]);
    const { data, error } = profileResult;
    if (error) {
      throw new Error(error.message);
    }
    const { data: timeData, error: timeError } = modeResult;
    if (timeError) {
      throw new Error(timeError.message);
    }
    const { data: modeData, error: modeError } = timeResult;
    if (modeError) {
      throw new Error(modeError.message);
    }

    return NextResponse.json(
      { message: "프로필 저장 성공", data, timeData, modeData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
