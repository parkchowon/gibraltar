import { GroupCreateType } from "@/types/group.type";
import apiClient from "./apiClient.api";

export const createGroup = async (group: GroupCreateType) => {
  try {
    await apiClient.post("api/group", {
      userId: group.userId,
      title: group.title,
      battle_tag: group.battleTag,
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

export const deleteGroup = async (groupId: string, userId: string) => {
  try {
    await apiClient.delete(`api/group/${userId}?group_id=${groupId}`);
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
  userId: string,
  groupOwnerId: string,
  position: string
) => {
  try {
    await apiClient.post(
      `api/group/${userId}?group_id=${groupId}&position=${position}`
    );

    await apiClient.post("api/notification", {
      reacted_user_id: userId,
      type: "groupJoin",
      user_id: groupOwnerId,
      mentioned_post_id: null,
      group_post_id: groupId,
    });
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
  groupOwnerId: string,
  status: string
) => {
  try {
    await apiClient.post(
      `api/group/${userId}/permission?group_id=${groupId}&status=${status}`
    );

    await apiClient.post("api/notification", {
      reacted_user_id: groupOwnerId,
      type: "groupPermission",
      user_id: userId,
      mentioned_post_id: null,
      group_post_id: groupId,
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateGroupStatus = async (groupId: string) => {
  try {
    await apiClient.post(`api/group/status?group_id=${groupId}`);
  } catch (error) {
    console.error(error);
  }
};
