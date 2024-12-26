import { create } from "zustand";

type UserTagProps = {
  selectedUser: number;
  setSelectedUser: (value: number) => void;
  selectedHandle: string;
  setSelectedHandle: (value: string) => void;
};

export const useUserTagStore = create<UserTagProps>((set) => ({
  selectedUser: 0,
  selectedHandle: "",
  setSelectedUser: (order) => set({ selectedUser: order }),
  setSelectedHandle: (handle) => set({ selectedHandle: handle.slice(1) }),
}));
