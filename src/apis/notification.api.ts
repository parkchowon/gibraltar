import { NotificationType } from "@/types/notification.type";
import apiClient from "./apiClient.api";

export const getNotification = async (
  userId: string | undefined,
  cursor: string
): Promise<NotificationType[]> => {
  try {
    const response = await apiClient.get(
      `api/notification?user_id=${userId}&cursor=${cursor}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
