import { createClient } from "@/supabase/server";
import { ProfileType } from "@/types/profile.type";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface UserProfile {
  user_id: string;
  bio?: string | null;
  favorite_team?: string | null;
  play_mode?: string[] | null;
  play_style?: string | null;
  play_time?: string[] | null;
  main_champs?: any; // Json 타입일 경우 any 사용
  play_champs?: any;
  tier?: string[] | null;
  tier_grade?: number[] | null;
}

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

    const updatedData: UserProfile = {
      user_id: userId, // `onConflict`로 필요한 필드
    };

    // 조건에 따라 필드 추가
    if (bio) updatedData.bio = bio;
    if (favoriteTeam) updatedData.favorite_team = favoriteTeam;
    if (playStyle?.mode) updatedData.play_mode = playStyle.mode;
    if (playStyle?.style) updatedData.play_style = playStyle.style;
    if (playStyle?.time) updatedData.play_time = playStyle.time;
    if (mainChamps) updatedData.main_champs = mainChamps;
    if (playChamps) updatedData.play_champs = playChamps;
    if (tier) updatedData.tier = tier;
    if (grade) updatedData.tier_grade = grade;

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(updatedData, { onConflict: "user_id" });

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "프로필 저장 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "서버로 인한 오류", status: 500 });
  }
};
