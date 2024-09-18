"use client";
import { useSearchParams } from "next/navigation";
import SettingChamp from "./step/SettingChamp";
import SettingPlaying from "./step/SettingPlaying";
import SettingProfile from "./step/SettingProfile";
import SettingTeam from "./step/SettingTeam";
import SettingText from "./step/SettingText";

function ProfileSetting() {
  const params = useSearchParams();
  const step = params.get("step");

  if (step) {
    switch (step) {
      case "1":
        return <SettingProfile />;
      case "2":
        return <SettingPlaying />;
      case "3":
        return <SettingChamp />;
      case "4":
        return <SettingTeam />;
      case "5":
        return <SettingText />;
    }
  }
}

export default ProfileSetting;
