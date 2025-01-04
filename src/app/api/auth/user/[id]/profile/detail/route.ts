import { createClient } from "@/supabase/server";
import { ProfileType } from "@/types/profile.type";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const {
    playStyle,
    playChamps,
    bio,
    favoriteTeam,
    userId,
    mainChamps,
    tier,
    grade,
  }: ProfileType = await request.json();

  try {
    if (playStyle) {
      const { mode, time, style } = playStyle;
      const playModes = mode?.map((mode) => {
        return { user_id: userId, play_mode: mode };
      });
      const playTime = time?.map((time) => {
        return { user_id: userId, play_time: time };
      });

      const [deleteModes, deleteTimes] = await Promise.all([
        supabase.from("play_modes").delete().eq("user_id", userId),
        supabase.from("play_times").delete().eq("user_id", userId),
      ]);
      if (deleteModes.error) throw new Error(deleteModes.error.message);
      if (deleteTimes.error) throw new Error(deleteTimes.error.message);

      if (playModes && playTime) {
        const [modeResult, timeResult] = await Promise.all([
          supabase.from("play_modes").upsert(playModes),
          supabase.from("play_times").upsert(playTime),
        ]);
        if (modeResult.error) throw new Error(modeResult.error.message);
        if (timeResult.error) throw new Error(timeResult.error.message);
      }
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        bio: bio,
        favorite_team: favoriteTeam,
        play_mode: playStyle?.mode,
        play_style: playStyle?.style,
        play_time: playStyle?.time,
        main_champs: mainChamps,
        play_champs: playChamps,
        tier: tier,
        tier_grade: grade,
      })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "프로필 저장 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류", status: 500 });
  }
};
