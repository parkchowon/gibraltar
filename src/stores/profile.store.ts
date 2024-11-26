import { ProfileSettingProps } from "@/types/hero.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProfileStore = create(
  persist<ProfileSettingProps>(
    (set) => ({
      nickname: "",
      playStyle: {
        mode: [],
        style: "",
        time: [],
      },
      playChamps: {
        MainChamps: [],
        selectedChamps: [],
      },
      favoriteTeam: "",
      bio: "",
      putNickname: (value) => set({ nickname: value }),
      putPlayStyle: (value) => set({ playStyle: value }),
      putPlayChamps: (value) => set({ playChamps: value }),
      putFavoriteTeam: (value) => set({ favoriteTeam: value }),
      putBio: (value) => set({ bio: value }),
    }),
    {
      name: "profile-step",
    }
  )
);
