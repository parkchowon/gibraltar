import { PostType } from "@/types/home.type";
import { create } from "zustand";

type ModalType = {
  postId: string;
  postUserId: string;
  top: number;
  left: number;
};

type modalType = "repost" | "quote" | "closed";

type PostStoreType = {
  isModalOpen: modalType;
  modal: ModalType;
  quotedPost: PostType | null;
  setQuotedPost: (value: PostType) => void;
  setIsModalOpen: (value: modalType) => void;
  setModal: (value: ModalType) => void;
};

export const usePostStore = create<PostStoreType>((set) => ({
  isModalOpen: "closed",
  quotedPost: null,
  modal: { postId: "", postUserId: "", top: 0, left: 0 },
  setQuotedPost: (value) => set({ quotedPost: value }),
  setIsModalOpen: (value) => set({ isModalOpen: value }),
  setModal: (position) =>
    set(() => {
      return { modal: position };
    }),
}));
