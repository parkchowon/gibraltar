import { GroupStoreProps } from "@/types/group.type";
import { create } from "zustand";

export const useGroupStore = create<GroupStoreProps>((set) => ({
  mode: "",
  position: ["", "", "", "", ""],
  tier: ["", ""],
  style: "",
  mic: "",
  searchingStatus: "",
  participantPos: "",
  participantUser: [],
  putMode: (value) => set({ mode: value }),
  putPosition: (value, index) =>
    set((state) => ({
      position: state.position.map((pos, i) => (i === index ? value : pos)),
    })),
  putTier: (value, index) =>
    set((state) => ({
      tier: state.tier.map((tier, i) => (i === index ? value : tier)),
    })),
  putStyle: (value) => set({ style: value }),
  putMic: (value) => set({ mic: value }),
  putStatus: (value) => set({ searchingStatus: value }),
  putParticipantPos: (value) => set({ participantPos: value }),
  putParticipantUser: (value) =>
    set((state) => ({ participantUser: [...state.participantUser, value] })),
}));
