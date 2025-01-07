import { Json } from "./supabase";

export type GroupStoreProps = {
  mode: string;
  position: string[];
  tier: string[];
  style: string;
  mic: string;
  searchingStatus: "모집" | "참가" | "안함" | "";
  participantPos: string;
  participantUser: {
    profile_url: string;
    nickname: string;
    handle: string;
  }[];
  putMode: (value: string) => void;
  putPosition: (value: string, index: number) => void;
  putTier: (value: string, index: number) => void;
  putStyle: (value: string) => void;
  putMic: (value: string) => void;
  putStatus: (value: "모집" | "참가" | "안함") => void;
  putParticipantPos: (value: string) => void;
  putParticipantUser: (value: {
    profile_url: string;
    nickname: string;
    handle: string;
  }) => void;
};

export type GroupCreateType = {
  userId: string;
  title: string;
  content: string;
  mode: string;
  position: string[];
  tier: string[];
  style: string;
  mic: string;
};

export type GroupType = {
  participant_count: number;
  content: string;
  created_at: string;
  group_status: string;
  id: string;
  mic: string | null;
  mode: string;
  position: Json[];
  style: string | null;
  tier: Json[] | null;
  title: string;
  user_id: string;
}[];

export type ParticipantUser = {
  participant_user_id: string;
  users: {
    profile_url: string;
    nickname: string;
    handle: string;
  } | null;
}[];

export type GroupStatusType = {
  data?: ParticipantUser;
  status: "모집" | "참가" | "안함";
};
