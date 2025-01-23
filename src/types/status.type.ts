import { StatusVariantsType } from "@/components/Status/UserStatus";

export type StatusTypeProps = {
  status: { state: string; color: string };
} & StatusVariantsType;

export type SideProfileType = {
  account_type: string | null;
  created_at: string;
  email: string;
  handle: string;
  id: string;
  nickname: string;
  profile_url: string;
  status: string | null;
  detail: {
    bio: string | null;
  } | null;
} | null;
