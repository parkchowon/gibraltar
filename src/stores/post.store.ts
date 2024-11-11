import { create } from "zustand";

type ModalType = {
  postId: string;
  postUserId: string;
  top: number;
  left: number;
};

type modalType = "repost" | "quote" | "closed";

type PostType = {
  isModalOpen: modalType;
  modal: ModalType;
  setIsModalOpen: (value: modalType) => void;
  setModal: (value: ModalType) => void;
};

export const usePostStore = create<PostType>((set) => ({
  isModalOpen: "closed",
  modal: { postId: "", postUserId: "", top: 0, left: 0 },
  setIsModalOpen: (value) => set({ isModalOpen: value }),
  setModal: (position) =>
    set(() => {
      return { modal: position };
    }),
}));
