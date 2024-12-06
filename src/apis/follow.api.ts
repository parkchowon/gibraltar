import apiClient from "./apiClient.api";

export const addFollow = async (userId: string, followingId: string) => {
  try {
    const response = await apiClient.post(
      `api/follow/${userId}?following-id=${followingId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const deleteFollow = async (userId: string, followingId: string) => {
  try {
    const response = await apiClient.delete(
      `api/follow/${userId}?following-id=${followingId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const checkFollow = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  try {
    const response = await apiClient.get(
      `api/follow/${followerId}/check?following-id=${followingId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
