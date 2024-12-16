import supabase from "@/supabase/client";
import apiClient from "./apiClient.api";
import { FollowType } from "@/types/profile.type";
import { ProfileDetailType } from "@/types/database";

export const getUser = async (userId: string) => {
  try {
    const response = await apiClient.get(`api/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserProfile = async (
  userId: string
): Promise<ProfileDetailType | null> => {
  try {
    const response = await apiClient.get(`api/auth/user/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserId = async (handle: string) => {
  try {
    const response = await apiClient.get(`api/auth/user/handle/${handle}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getFollower = async (userId: string): Promise<FollowType> => {
  try {
    const response = await apiClient.get(`api/auth/user/${userId}/follow`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPostCount = async (userId: string) => {
  try {
    const response = await apiClient.get(`api/post/user/${userId}/count`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const findDuplicateHandle = async (handle: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("handle", `@${handle}`)
    .single();
  if (error) {
    console.error(error);
  }
  return !!data;
};

export const userStatusUpdate = async (userId: string, status: string) => {
  try {
    const response = await apiClient.patch(`api/auth/user/${userId}/status`, {
      status: status,
    });
  } catch (error) {
    console.error(error);
  }
};
