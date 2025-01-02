import apiClient from "./apiClient.api";
import {
  ProfileProps,
  ProfileType,
  RecommendedUserType,
} from "@/types/profile.type";

// 회원가입 후 프로필 세팅
export const insertProfileSetting = async (profile: ProfileType) => {
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
  } catch (error) {
    console.error(error);
  }
};

// users table의 update
export const profileUpdate = async ({
  nickname,
  handle,
  file,
  userId,
}: ProfileProps) => {
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

// TODO: user_profile 테이블의 update
export const profileDetailUpdate = async (profile: ProfileType) => {
  try {
    const response = await apiClient.post(
      `api/auth/user/${profile.userId}/profile/detail`,
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
  }
};

// 첫 프로필 세팅 후 추천 유저 불러오기
export const getRecommendedUsers = async (
  profile: ProfileType
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
  profile: ProfileType
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
