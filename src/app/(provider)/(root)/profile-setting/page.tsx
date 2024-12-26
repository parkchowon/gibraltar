"use client";
import { Suspense } from "react";
import ProfileSetting from "./_components/ProfileSetting";
import LogoLoading from "@/components/Loading/LogoLoading";

function ProfileSettingPage() {
  return (
    <Suspense fallback={<LogoLoading />}>
      <ProfileSetting />
    </Suspense>
  );
}
export default ProfileSettingPage;
