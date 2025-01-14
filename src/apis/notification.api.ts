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

export const updateNotification = async (userId: string) => {
  try {
    await apiClient.patch(`api/notification?user_id=${userId}`);
  } catch (error) {
    console.error(error);
  }
};

// export const createNotificationTagUser = async(handles: string[], userId: string)=>{
//   try{
//     const userIds = handles.map((handle)=>{
//       const response = await apiClient.get(`api/auth/user/handle/${handle}`);
//       return response.data as string;
//     })

//     userIds.map((reactedUserId)=>{
//       const { data: notiData } = await apiClient.post("/api/notification", {
//         reacted_user_id: reactedUserId,
//         type: "comment",
//         user_id: userId,
//         mentioned_post_id: ,
//         related_post_id: null,
//       });
//     })

//   }catch(error){
//     console.error(error)
//   }
// }
