import { getNotification } from "@/apis/notification.api";

export type NotiType = Awaited<ReturnType<typeof getNotification>>[number];
