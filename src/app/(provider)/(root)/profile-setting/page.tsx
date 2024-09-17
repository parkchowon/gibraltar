"use client";
import { useSearchParams } from "next/navigation";
import SettingChamp from "./_components/step/SettingChamp";
import SettingPlaying from "./_components/step/SettingPlaying";
import SettingProfile from "./_components/step/SettingProfile";
import SettingTeam from "./_components/step/SettingTeam";
import SettingText from "./_components/step/SettingText";

function ProfileSettingPage() {
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
export default ProfileSettingPage;
