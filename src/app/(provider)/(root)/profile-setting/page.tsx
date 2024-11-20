"use client";
import { Suspense } from "react";
import ProfileSetting from "./_components/ProfileSetting";

function ProfileSettingPage() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <ProfileSetting />
    </Suspense>
  );
}
export default ProfileSettingPage;
