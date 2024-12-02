import ArrowHeadBtn from "@/assets/icons/arrow_head.svg";
import { useState } from "react";
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
        <div className="flex w-full h-[428px] py-5 gap-6">
          <div className="w-64 h-full border-[1px] border-gray-400 rounded-md"></div>
          <div className="flex-grow h-full border-[1px] border-gray-400 rounded-md"></div>
        </div>
      )}
    </>
  );
}

export default ProfileDetail;
