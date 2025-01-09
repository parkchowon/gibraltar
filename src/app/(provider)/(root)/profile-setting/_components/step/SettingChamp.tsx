import { fetchHero } from "@/apis/overwatch.api";
import LeftButton from "@/assets/button/rectangle-button.svg";
import { PLAY_POSITION } from "@/constants/profile";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import HeroByRole from "../HeroByRole";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";
import LogoLoading from "@/components/Loading/LogoLoading";
import Image from "next/image";

function SettingChamp() {
  const [positionClick, setPositionClick] = useState<string>("tank");
  const [bgColor, setBgColor] = useState<string>("#f0f0f0");
  const [checkPass, setCheckPass] = useState<boolean>(false);
  // 영웅 목록 불러오기
  const { isPending, data } = useQuery({
    queryKey: ["heroData"],
    queryFn: () => {
      return fetchHero();
    },
  });

  // 버튼 활성화
  useEffect(() => {
    setCheckPass(!!positionClick);
  }, [positionClick]);

  // 다음 버튼 클릭 시
  const handleSubmit = async () => {};

  const handleClickRole = (position: string, color: string) => {
    setPositionClick(position);
    setBgColor(color);
  };

  return (
    <ProfileSettingContainer
      title="주로 사용하는 영웅이 있나요?"
      sub="플레이 하는 캐릭터를 한 번, 자신 있는 영웅은 두번 클릭하세요."
    >
      <div className="flex my-10">
        <div className="flex flex-col -space-y-7 -mr-[1.1px]">
          {PLAY_POSITION.map((item, idx) => {
            return (
              <button
                key={item.id}
                className={`relative z-${3 - idx}0 ${
                  item.color === bgColor ? "z-40" : idx === 2 ? "z-10" : "z-30"
                }`}
                onClick={() => handleClickRole(item.id, item.color)}
              >
                <div className="flex flex-col absolute top-14 left-1/2 transform -translate-x-1/2 items-center justify-center gap-2">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <Image src={item.icon} alt="icon" width={15} height={15} />
                </div>
                <LeftButton
                  width="66"
                  hight="178"
                  style={{ color: `${item.color}` }}
                />
              </button>
            );
          })}
        </div>
        <div
          style={{ backgroundColor: bgColor }}
          className={`w-[784px] h-[465px] py-7 px-[60px] rounded-r-2xl`}
        >
          {isPending ? (
            <div className="w-full h-full">
              <LogoLoading />
            </div>
          ) : (
            <HeroByRole heroes={data} position={positionClick} />
          )}
        </div>
      </div>
      <p className="font-medium text-sm text-gray-600 text-center mb-[11px]">
        다중 선택이 가능해요.
      </p>
      <NextStepButton isClickable={checkPass} onClick={handleSubmit} />
    </ProfileSettingContainer>
  );
}

export default SettingChamp;
