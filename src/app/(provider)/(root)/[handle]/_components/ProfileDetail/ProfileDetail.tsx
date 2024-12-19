import ArrowHeadBtn from "@/assets/icons/arrow_head.svg";
import { useState } from "react";
import TierBox from "./TierBox";
import { PLAY_POSITION } from "@/constants/profile";
import HeroBox from "./HeroBox";
function ProfileDetail() {
  // TODO: 세부 프로필 보여주기 (화면이 없음)

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const handleDetailProfileClick = () => {
    setIsDetailOpen(!isDetailOpen);
  };

  return (
    <>
      <div
        className={`flex py-3 border-t-[1px] ${
          isDetailOpen && "border-b-[1px]"
        } justify-center border-gray-400`}
      >
        <button onClick={handleDetailProfileClick} className="flex gap-10">
          <p className="text-xs font-semibold">세부 프로필 펼치기</p>
          <div className="grid place-items-center w-4 h-4 rotate-90">
            <ArrowHeadBtn width="5" height="9" />
          </div>
        </button>
      </div>
      {isDetailOpen && (
        <div className="flex flex-col w-full h-[428px] py-5 gap-6">
          <div className="flex border-[1px] border-gray-400 w-full rounded-md px-3 py-4 gap-4">
            {/* 티어 */}
            <div className="flex w-fit px-2 py-2 text-center bg-white/30 rounded-2xl">
              <p className="font-semibold">티어</p>
              <div className="flex gap-2">
                {PLAY_POSITION.map((pos) => {
                  return <TierBox key={pos.id} pos={pos.name} />;
                })}
              </div>
            </div>
            {/* 플레이 영웅 */}
            <div className="flex-grow py-2 px-2 bg-white/30 rounded-2xl text-center"></div>
          </div>
          <div className="flex w-full flex-grow border-[1px] border-gray-400 rounded-md"></div>
        </div>
      )}
    </>
  );
}

export default ProfileDetail;
