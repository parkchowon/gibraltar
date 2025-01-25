import { insertProfileSetting } from "@/apis/profile.api";
import { useAuth } from "@/contexts/auth.context";
import { useProfileStore } from "@/stores/profile.store";
import { useState } from "react";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";
import { MAX_BIO_LENGTH } from "@/constants/textLength";

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
        className="lg:w-[404px] w-[280px] resize-none border-[1px] border-black rounded-[15px] lg:h-[367px] h-60 px-6 py-5 lg:my-[84px] my-12 text-sm lg:text-base outline-none"
        placeholder="저는 오버워치를 하는 트레이서라고 해요"
        maxLength={MAX_BIO_LENGTH}
      ></textarea>
      <NextStepButton isClickable={!!text} onClick={handleSubmit} />
    </ProfileSettingContainer>
  );
}

export default SettingText;
