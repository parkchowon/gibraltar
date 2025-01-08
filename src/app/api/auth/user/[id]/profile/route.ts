import { createClient } from "@/supabase/server";
import { ProfileType } from "@/types/profile.type";
import { Json } from "@/types/supabase";
import { cookies } from "next/headers";
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

  if (!userId) {
    return NextResponse.json(
      { message: "유저 아이디가가 없음" },
      { status: 400 }
    );
  }
  const { mode, time, style } = playStyle as {
    mode?: string[];
    style: string | null;
    time?: string[];
  };

  try {
    const playModes = mode
      ? (mode as string[]).map((mode) => {
          return { user_id: userId, play_mode: mode };
        })
      : undefined;
    const playTime = time
      ? (time as string[]).map((time) => {
          return { user_id: userId, play_time: time };
        })
      : undefined;

    const { data, error } = await supabase.from("user_profiles").upsert({
      user_id: userId,
      bio: bio,
      favorite_team: favoriteTeam,
      play_mode: mode as Json,
      play_style: style,
      play_time: time as Json,
      main_champs: mainChamps as Json,
      play_champs: playChamps as Json,
      tier: [] as Json,
      tier_grade: [] as Json,
    });
    if (error) throw new Error(error.message);

    if (playModes && playTime) {
      const [modeResult, timeResult] = await Promise.all([
        supabase.from("play_modes").upsert(playModes),
        supabase.from("play_times").upsert(playTime),
      ]);
      if (modeResult.error) throw new Error(modeResult.error.message);
      if (timeResult.error) throw new Error(timeResult.error.message);
    }

    // session에 cookie 저장
    const expires = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000); // 100일 후
    cookies().set("hasProfileSetting", "true", {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

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
