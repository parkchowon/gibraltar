import supabase from "@/supabase/client";
import { profileType } from "@/types/hero.type";
import apiClient from "./apiClient.api";
import { RecommendedUserType } from "@/types/profile.type";

// 회원가입 후 프로필 세팅
export const insertProfileSetting = async (profile: profileType) => {
  try {
    const response = await apiClient.post(
      `api/auth/user/${profile.userId}/profile`,
      profile,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
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

// users table의 update
export const profileUpdate = async ({
  nickname,
  handle,
  file,
  userId,
}: profileProps) => {
  try {
    const formData = new FormData();
    let profile_url = undefined;
    if (file) {
      formData.append("profile_url", file);
      formData.append("user_id", userId);
      const response = await apiClient.patch(
        `api/storage/profile-url`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      profile_url = response.data.urls;
    }
    const response = await apiClient.patch(`api/auth/user/${userId}/profile`, {
      nickname: nickname,
      handle: handle,
      profile_url: profile_url,
    });
    return false;
  } catch (error) {
    return true;
  }
};

// 첫 프로필 세팅 후 추천 유저 불러오기
export const getRecommendedUsers = async (
  profile: profileType
): Promise<RecommendedUserType> => {
  try {
    const response = await apiClient.post(
      `api/auth/user/${profile.userId}/recommendations`,
      profile,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const randomUserRecommendation = async (
  profile: profileType
): Promise<RecommendedUserType> => {
  try {
    const response = await apiClient.post(
      `api/auth/user/${profile.userId}/recommendations/random`,
      profile,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
