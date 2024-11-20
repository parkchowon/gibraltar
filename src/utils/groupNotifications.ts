import { groupBy } from "lodash";
import { NotiType } from "../types/notification.type";
export const groupNotifications = (notifications: NotiType[]) => {
  const groupedNotifications = groupBy(notifications, "related_post_id");
  return groupNotifications;
};
