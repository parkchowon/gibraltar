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
    id: string;
    profile_url: string;
    nickname: string;
    handle: string;
    status: string;
  }[];
  participantGroup: {
    group_id: string;
    participant_status: string;
  };
  rejectedGroup: {
    group_id: string;
    participant_status: string;
  }[];
  groupId: string;
  putMode: (value: string) => void;
  putPosition: (value: string, index: number) => void;
  putTier: (value: string, index: number) => void;
  putStyle: (value: string) => void;
  putMic: (value: string) => void;
  putStatus: (value: "모집" | "참가" | "안함") => void;
  putParticipantPos: (value: string) => void;
  putParticipantUser: (value: {
    id: string;
    profile_url: string;
    nickname: string;
    handle: string;
    status: string;
  }) => void;
  putParticipantGroup: (value: {
    group_id: string;
    participant_status: string;
  }) => void;
  putGroupId: (value: string) => void;
  putRejectedGroup: (value: {
    group_id: string;
    participant_status: string;
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

export type ParticipantUserType = {
  group_id: string;
  participant_user_id: string;
  participant_status: string;
  users: {
    id: string;
    profile_url: string;
    nickname: string;
    handle: string;
  } | null;
}[];

export type ParticipantGroupType = {
  group_id: string;
  participant_status: string;
};

export type GroupStatusType = {
  data?: ParticipantUserType | ParticipantGroupType;
  status: "모집" | "참가" | "안함";
};
