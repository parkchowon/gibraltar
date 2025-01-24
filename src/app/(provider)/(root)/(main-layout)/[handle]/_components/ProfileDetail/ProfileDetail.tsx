import ArrowHeadBtn from "@/assets/icons/arrow_head.svg";
import { useState } from "react";
import TierBox from "./TierBox";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/apis/auth.api";
import HeroBox from "./HeroBox";
import ModeBox from "./ModeBox";
import TimeBox from "./TimeBox";
import StyleBox from "./StyleBox";
import TeamBox from "./TeamBox";
import { HeroType } from "@/types/hero.type";
function ProfileDetail({ userId }: { userId: string }) {
  const { data: profile, isPending } = useQuery({
    queryKey: ["profileDetail", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const handleDetailProfileClick = () => {
    setIsDetailOpen(!isDetailOpen);
  };

  return (
    <>
      <div
        className={`flex py-3 border-t-[1px] ${
          isDetailOpen && "border-b-[1px]"
        } justify-center border-mainGray`}
      >
        <button onClick={handleDetailProfileClick} className="flex gap-10">
          <p className="text-xs font-semibold">세부 프로필 펼치기</p>
          <div className="grid place-items-center w-4 h-4 rotate-90">
            <ArrowHeadBtn width="5" height="9" />
          </div>
        </button>
      </div>
      {isPending && <></>}
      {isDetailOpen && (
        <div className="flex flex-col w-full h-fit py-5 gap-3">
          <div className="flex w-full px-3 gap-4">
            {/* 티어 */}
            <TierBox
              tier={profile?.tier as string[]}
              grade={profile?.tier_grade as number[]}
            />
            {/* 플레이 영웅 */}
            <HeroBox
              main={profile?.main_champs as HeroType[]}
              play={profile?.play_champs as HeroType[]}
            />
          </div>
          <div className="flex w-full h-[272px] max-h-72 grid-cols-4 px-3 gap-4">
            <ModeBox mode={profile?.play_mode as string[]} />
            <TimeBox time={profile?.play_time as string[]} />
            <StyleBox style={profile?.play_style ?? undefined} />
            <TeamBox team={profile?.favorite_team ?? undefined} />
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileDetail;
