import { fetchHero } from "@/apis/overwatch.api";
import { PLAY_POSITION } from "@/constants/profile";
import { useProfileStore } from "@/stores/profile.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import HeroByRole from "../HeroByRole";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingChamp() {
  const [positonClick, setPositionClick] = useState<string>("tank");
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const { putPlayChamps } = useProfileStore();

  // 영웅 목록 불러오기
  const { isPending, data } = useQuery({
    queryKey: ["heroData"],
    queryFn: () => {
      return fetchHero();
    },
  });

  // 버튼 활성화
  useEffect(() => {
    setCheckPass(!!positonClick);
  }, [positonClick]);

  // 다음 버튼 클릭 시
  const handleSubmit = () => {
    putPlayChamps({
      position: [],
      champs: [],
    });
  };

  const handleClickPosition = (positon: string) => {
    setPositionClick(positon);
  };

  return (
    <ProfileSettingContainer
      title="플레이 성향을 알려주세요."
      sub="입력한 정보를 기반으로 잘 맞는 친구를 소개해드릴게요!"
    >
      <div className="">
        <div className="w-[404px]">
          <p className="font-bold mb-6">내가 즐겨 하는 역할군은...</p>
          <div className="grid grid-cols-3 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
            {PLAY_POSITION.map((pos) => {
              return (
                <button
                  key={pos.id}
                  onClick={() => handleClickPosition(pos.id)}
                  className={`${positonClick === pos.id ? "bg-mint" : null} ${
                    pos.id === "tank" ? "rounded-l-xl" : null
                  } ${pos.id === "support" ? "rounded-r-xl" : null}`}
                >
                  {pos.name}
                </button>
              );
            })}
          </div>
        </div>
        {isPending ? (
          <p>loading...</p>
        ) : (
          <HeroByRole heroes={data} position={positonClick} />
        )}

        <p className="font-medium text-sm text-gray-600 text-center">
          다중 선택이 가능해요.
        </p>
      </div>
      <NextStepButton isClickable={checkPass} onClick={handleSubmit} />
    </ProfileSettingContainer>
  );
}

export default SettingChamp;
