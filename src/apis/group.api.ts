import { GroupCreateType } from "@/types/group.type";
import apiClient from "./apiClient.api";

export const createGroup = async (group: GroupCreateType) => {
  try {
    await apiClient.post("/api/group", {
      userId: group.userId,
      title: group.title,
      content: group.content,
      mode: group.mode,
      position: group.position,
      tier: group.tier,
      style: group.style,
      mic: group.mic,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getGroup = async (cursor: number) => {
  try {
    const response = await apiClient.get(`api/group?cursor=${cursor}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createParticipantGroup = async (
  groupId: string,
  userId: string
) => {
  try {
    await apiClient.post(`api/group/${userId}?group_id=${groupId}`);
  } catch (error) {
    console.error(error);
  }
};

export const getUserGroup = async (userId: string) => {
  try {
    const response = await apiClient.get(`api/group/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateParticipantGroup = async (
  userId: string,
  groupId: string,
  status: string
) => {
  try {
    await apiClient.post(
      `api/group/${userId}/permission?group_id=${groupId}&status=${status}`
    );
  } catch (error) {
    console.error(error);
  }
};
