import supabase from "@/supabase/client";
import { profileType, RankedUsersType } from "@/types/hero.type";
import apiClient from "./apiClient.api";

// 회원가입 후 프로필 세팅
export const insertProfileSetting = async (profile: profileType) => {
  try {
    const response = await apiClient.post(
      `api/auth/user/${profile.userId}/profile`
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

type profileProps = {
  nickname?: string;
  handle: string;
  file?: File;
  userId: string;
};

export const profileUpdate = async ({
  nickname,
  handle,
  file,
  userId,
}: profileProps) => {
  let profileUrl = null;

  const { data, error } = await supabase
    .from("users")
    .select("profile_url")
    .eq("id", userId)
    .single();
  if (data) {
    const isExist = data.profile_url.includes(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string
    );
    if (isExist) {
      const oldProfile = data.profile_url.split("/").pop();
      await supabase.storage
        .from("profile-images")
        .remove([`${userId}/${oldProfile}`]);
    }
  }

  if (file) {
    const filePath = `${userId}/${Date.now()}_${file.name}`;
    const { data: saveStorageData, error: saveStorageError } =
      await supabase.storage.from("profile-images").upload(filePath, file);
    if (saveStorageError) {
      console.error(saveStorageError);
      return;
    }
    profileUrl = supabase.storage.from("profile-images").getPublicUrl(filePath)
      .data.publicUrl;
  }

  const { data: updateData, error: updateError } = await supabase
    .from("users")
    .update({
      profile_url: profileUrl || undefined,
      nickname: nickname || undefined,
      handle: handle,
    })
    .eq("id", userId);

  if (updateError) {
    console.error(updateError);
  }
};

// 첫 프로필 세팅 후 추천 유저 불러오기
export const getRecommendedUsers = async (profile: profileType) => {
  const { data: modeResult, error: modeError } = await supabase
    .from("play_modes")
    .select("user_id")
    .in("play_mode", profile.playStyle.mode)
    .neq("user_id", profile.userId)
    .range(0, 10);

  // TODO: modeResult가 없을 시 해야되는 로직을 추가

  // 중복을 없앤 게임 모드 취향이 하나라도 같은 사람들 배열
  const modeUserId =
    (modeResult && modeResult.map((mode) => mode.user_id)) || [];
  const sameModePlayer = modeUserId.filter(
    (mode, index) => modeUserId.indexOf(mode) === index
  );

  // 게임 모드 취향이 같은 사람들 배열에서 시간대, 게임 성향, 좋아하는 팀이 겹치는지 확인
  const [user, team, style, time, follow] = await Promise.all([
    supabase
      .from("users")
      .select(
        "id, nickname, profile_url, handle, profile:user_profiles(bio, play_style, play_mode, play_time, favorite_team)"
      )
      .in("id", sameModePlayer),
    supabase
      .from("user_profiles")
      .select("user_id")
      .in("user_id", sameModePlayer)
      .eq("favorite_team", profile.favoriteTeam),
    supabase
      .from("user_profiles")
      .select("user_id")
      .in("user_id", sameModePlayer)
      .eq("play_style", profile.playStyle.style),
    supabase
      .from("play_times")
      .select("user_id")
      .in("user_id", sameModePlayer)
      .in("play_time", profile.playStyle.time),
    supabase
      .from("followers")
      .select("*")
      .in("following_id", sameModePlayer)
      .eq("follower_id", profile.userId),
  ]);

  const { data: userResult, error: userError } = user;
  const { data: teamResult, error: teamError } = team;
  const { data: styleResult, error: styleError } = style;
  const { data: timeResult, error: timeError } = time;
  const { data: followResult, error: followError } = follow;

  // 추천 유저 알고리즘
  const calculateScore = (userId: string) => {
    let score = 0;

    // 게임 플레이 모드가 맞을 수록
    const modeScore = modeUserId.filter((user) => user === userId).length;
    if (profile.playStyle.mode.length === modeScore) {
      score += 160;
    } else {
      score += modeScore * 40;
    }

    // 게임 성향이 맞으면
    if (styleResult?.some((user) => user.user_id === userId)) {
      score += 25;
    }

    // 시간대가 맞을 수록
    const timeScore = timeResult
      ? timeResult.filter((time) => time.user_id === userId).length
      : 0;
    score += timeScore * 20;

    if (teamResult?.some((user) => user.user_id === userId)) {
      score += 10;
    }

    return score;
  };

  const scoredUsers = sameModePlayer.map((userId) => ({
    user: userResult?.find((user) => user.id === userId) ?? null,
    isFollowing:
      followResult?.length !== 0
        ? !!followResult?.find((follow) => {
            follow.follower_id === userId;
          })?.id
        : false,
    score: calculateScore(userId),
  }));

  const rankedUsers = scoredUsers
    ? scoredUsers.sort((a, b) => b.score - a.score)
    : null;

  return rankedUsers;
};
