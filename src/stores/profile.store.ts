import { create } from "zustand";
import { persist } from "zustand/middleware";


type playStyleType = {
  mode: number[];
  style: number;
  time: number[];
};

type playChampsType = {
  position: number[];
  champs: string[];
}

type ProfileSettingProps = {
  playStyle: playStyleType;
  putPlayStyle: (value: playStyleType) => void;
  playChamps:playChampsType;
  putPlayChamps: (value: playChampsType)=> void;
  favoriteTeam: string;
  putFavoriteTeam: (value: string) => void;
  bio: string;
  putBio: (value: string)=>void;
}

export const useProfileStore = create(
  persist<ProfileSettingProps>(
    (set)=>({
      playStyle: {
        mode: [],
        style: 0,
        time: []
      },
      playChamps: {
        position: [],
        champs: []
      },
      favoriteTeam: '',
      bio: '',
      putPlayStyle: (value) => set({playStyle: value}),
      putPlayChamps: (value)=> set({playChamps: value}),
      putFavoriteTeam: (value) => set({favoriteTeam: value}),
      putBio: (value)=>set({bio: value})
    }),
    {
      name: 'profile-step',
    }
)
)