import { StatusVariantsType } from "@/components/Status/UserStatus";

export type StatusTypeProps = {
  status: { state: string; color: string };
} & StatusVariantsType;
