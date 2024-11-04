import { create } from "zustand";

type ModalType = {
  postId: string;
  postUserId: string;
  top: number;
  left: number;
};

type PostType = {
  isModalOpen: boolean;
  isRepostClick: boolean;
  modal: ModalType;
  setIsModalOpen: () => void;
  setModal: (value: ModalType) => void;
  setRepostClick: () => void;
};

export const usePostStore = create<PostType>((set) => ({
  isModalOpen: false,
  isRepostClick: false,
  modal: { postId: "", postUserId: "", top: 0, left: 0 },
  setIsModalOpen: () =>
    set((prev) => {
      return { isModalOpen: !prev.isModalOpen };
    }),
  setModal: (position) =>
    set(() => {
      return { modal: position };
    }),
  setRepostClick: () =>
    set((prev) => {
      return { isRepostClick: !prev.isRepostClick };
    }),
}));
