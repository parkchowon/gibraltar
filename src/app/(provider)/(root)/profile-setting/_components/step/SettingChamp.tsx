import { PLAY_POSITION } from "@/constants/profile";
import { useState } from "react";
import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingChamp() {
  const [positonClick, setPositionClick] = useState<number[]>([]);

  const handleClickPosition = (positon: number) => {
    if (positonClick.includes(positon)) {
      setPositionClick(positonClick.filter((pos) => pos !== positon));
    } else {
      setPositionClick([...positonClick, positon]);
    }
  };
  return (
    <ProfileSettingContainer
      title="플레이 성향을 알려주세요."
      sub="입력한 정보를 기반으로 잘 맞는 친구를 소개해드릴게요!"
    >
      <div className="w-[404px] mt-[66px] mb-[30px]">
        <p className="font-bold mb-6">내가 즐겨 하는 모드는...</p>
        <div className="grid grid-cols-3 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
          {PLAY_POSITION.map((pos) => {
            return (
              <button
                key={pos.id}
                onClick={() => handleClickPosition(pos.id)}
                className={`${
                  positonClick.includes(pos.id) ? "bg-mint" : null
                } ${pos.id === 1 ? "rounded-l-xl" : null} ${
                  pos.id === 3 ? "rounded-r-xl" : null
                }`}
              >
                {pos.name}
              </button>
            );
          })}
        </div>
        <p className="font-medium text-sm text-gray-600 text-center mt-3">
          다중 선택이 가능해요.
        </p>
      </div>
    </ProfileSettingContainer>
  );
}

export default SettingChamp;
