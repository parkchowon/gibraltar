import { insertProfileSetting } from "@/apis/profile.api";
import { useAuth } from "@/contexts/auth.context";
import { useProfileStore } from "@/stores/profile.store";
import { useState } from "react";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingText() {
  const [text, setText] = useState<string>("");
  const { putBio } = useProfileStore();
  const { user } = useAuth();
  const { favoriteTeam, playChamps, playStyle } = useProfileStore();

  const handleSubmit = async () => {
    putBio(text);
    if (user) {
      const profile = {
        userId: user.id,
        bio: text,
        playStyle: playStyle,
        mainChamps: playChamps.MainChamps,
        playChamps: playChamps.selectedChamps,
        favoriteTeam: favoriteTeam,
      };
      await insertProfileSetting(profile);
    }
  };

  return (
    <ProfileSettingContainer
      title="마지막 단계예요!"
      sub="나를 표현하는 소개글을 적어보세요."
    >
      <textarea
        autoFocus
        onChange={(e) => setText(e.currentTarget.value)}
        className="w-[404px] resize-none border-[1px] border-black rounded-[15px] h-[367px] px-6 py-5 my-[84px] outline-none"
        placeholder="저는 오버워치를 하는 트레이서라고 해요"
      ></textarea>
      <NextStepButton isClickable={!!text} onClick={handleSubmit} />
    </ProfileSettingContainer>
  );
}

export default SettingText;
