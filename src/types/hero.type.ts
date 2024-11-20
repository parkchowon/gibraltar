import { getRecommendedUsers } from "@/apis/profile.api";
import { Json } from "./supabase";

export type HeroType = {
  key: string;
  name: string;
  portrait: string;
  role: "tank" | "damage" | "support";
};

export type playStyleType = {
  mode: string[];
  style: string;
  time: string[];
};

export type playChampsType = {
  MainChamps: HeroType[];
  selectedChamps: HeroType[];
};

export type profileType = {
  userId: string;
  bio: string;
  playStyle: playStyleType;
  mainChamps?: HeroType[];
  playChamps?: HeroType[];
  favoriteTeam: string;
};

export type ProfileSettingProps = {
  playStyle: playStyleType;
  putPlayStyle: (value: playStyleType) => void;
  playChamps: playChampsType;
  putPlayChamps: (value: playChampsType) => void;
  favoriteTeam: string;
  putFavoriteTeam: (value: string) => void;
  bio: string;
  putBio: (value: string) => void;
};

export type RankedUsersType = Awaited<ReturnType<typeof getRecommendedUsers>>;
