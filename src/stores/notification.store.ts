import { NotiStoreProps } from "@/types/notification.type";
import { create } from "zustand";

export const useNotificationStore = create<NotiStoreProps>((set) => ({
  notiCount: false,
  putNotiCount: (value) => set({ notiCount: value }),
}));
