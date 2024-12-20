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
      tier: ["", "", ""],
      grade: [0, 0, 0],
      putNickname: (value) => set({ nickname: value }),
      putPlayStyle: (value) => set({ playStyle: value }),
      putPlayChamps: (value) => set({ playChamps: value }),
      putFavoriteTeam: (value) => set({ favoriteTeam: value }),
      putBio: (value) => set({ bio: value }),
      putTier: (value) => set({ tier: value }),
      putGrade: (value) => set({ grade: value }),
    }),
    {
      name: "profile-step",
    }
  )
);
