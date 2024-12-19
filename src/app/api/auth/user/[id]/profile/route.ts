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
  }: ProfileType = await request.json();

  const { mode, time, style } = playStyle;
  if (!playStyle || !bio || !favoriteTeam || !userId) {
    return NextResponse.json({ message: "데이터가 없음" }, { status: 400 });
  }
  try {
    const playModes = mode.map((mode) => {
      return { user_id: userId, play_mode: mode };
    });
    const playTime = time.map((time) => {
      return { user_id: userId, play_time: time };
    });
    const [profileResult, modeResult, timeResult] = await Promise.all([
      supabase.from("user_profiles").insert({
        user_id: userId,
        bio: bio,
        favorite_team: favoriteTeam,
        play_mode: mode,
        play_style: style,
        play_time: time,
        main_champs: mainChamps,
        play_champs: playChamps,
      }),
      supabase.from("play_modes").upsert(playModes),
      supabase.from("play_times").upsert(playTime),
    ]);
    if (profileResult.error) throw new Error(profileResult.error.message);
    if (modeResult.error) throw new Error(modeResult.error.message);
    if (timeResult.error) throw new Error(timeResult.error.message);

    return NextResponse.json({ message: "프로필 저장 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};

/** 상세 프로필 받아오는 로직직 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const userId = params.id;

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};

/** 아직까진 가입 할떄 프로필 업데이트만 되는 로직 */
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const userId = params.id;
  const { profile_url, nickname, handle } = await request.json();

  try {
    const { data: updateData, error: updateError } = await supabase
      .from("users")
      .update({
        profile_url: profile_url || undefined,
        nickname: nickname || undefined,
        handle: handle || undefined,
      })
      .eq("id", userId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({ message: "업데이트 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "프로필 수정 중 서버 오류", error },
      { status: 500 }
    );
  }
};
