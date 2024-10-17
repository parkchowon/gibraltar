import { getRecommendedUsers } from "@/apis/profile.api";
import ArrowBtn from "@/assets/icons/arrow.svg";
import { useAuth } from "@/contexts/auth.context";
import { useProfileStore } from "@/stores/profile.store";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";
import SearchingPage from "../SearchingPage";

function FollowUser() {
  const [cardIndex, setCardIndex] = useState<number>(0);
  const handleSubmit = () => {};

  const { userData } = useAuth();
  const { bio, favoriteTeam, playChamps, playStyle } = useProfileStore();

  const { isPending, data: FollowingList } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: () => {
      if (userData) {
        const profile = {
          userId: userData.id,
          bio: bio,
          playStyle: playStyle,
          mainChamps: playChamps.MainChamps,
          playChamps: playChamps.selectedChamps,
          favoriteTeam: favoriteTeam,
        };
        return getRecommendedUsers(profile);
      }
    },
  });

  const handleClickArrow = (state: boolean) => {
    if (state && FollowingList && cardIndex !== FollowingList.length - 1) {
      setCardIndex(cardIndex + 1);
    } else if (!state && cardIndex !== 0) {
      setCardIndex(cardIndex - 1);
    }
  };

  if (isPending) {
    return <SearchingPage />;
  }

  if (!FollowingList) {
    return (
      <ProfileSettingContainer
        title="조건과 꼭 맞는 유저를 찾지 못했어요."
        sub="그 대신 이런 유저를 팔로우 해보시는건 어떤가요?"
      ></ProfileSettingContainer>
    );
  }

  return (
    <ProfileSettingContainer
      title={`나와 공통점이 있는 계정을\n${
        FollowingList ? FollowingList.length : 0
      }개 찾았어요!`}
    >
      <div className="flex justify-center gap-[30px] mb-[68px]">
        <button onClick={() => handleClickArrow(false)}>
          <ArrowBtn
            width="24"
            height="42"
            style={{ transform: "rotate(180deg)" }}
          />
        </button>
        <div className="relative w-[404px] h-[463px]">
          {FollowingList.map((follow, idx) => {
            const followModes = follow.user?.profile[0].play_mode as string[];
            const followTimes = follow.user?.profile[0].play_time as string[];
            return (
              <div
                key={idx}
                className={`absolute flex-col w-[404px] h-[463px] items-center bg-white top-0 left-0 pt-[35px] px-6 pb-[22px] border border-black rounded-2xl ${
                  idx === cardIndex ? "flex" : "hidden"
                }`}
              >
                <Image
                  alt="profile"
                  src={follow.user?.profile_url || ""}
                  width={106}
                  height={106}
                  className="rounded-full"
                />
                <p className="text-lg font-medium mt-3.5">
                  {follow.user?.nickname}
                </p>
                <p className="font-medium text-gray-400 mb-1">
                  {follow.user?.handle}
                </p>
                <p className=" w-full h-12 mb-1.5 text-center">
                  {follow.user?.profile[0].bio}
                </p>

                {/* 같은 게임 모드 */}
                <p className="text-gray-500">
                  {userData?.nickname}님처럼{" "}
                  <span className="font-bold text-black">
                    {followModes
                      .filter((mode) => playStyle.mode.includes(mode))
                      .join(",")}
                  </span>
                  을 즐기는 유저예요
                </p>
                {/* 같은 시간대 */}
                {followTimes && (
                  <p className="text-gray-500">
                    같은{" "}
                    <span className="font-bold text-black">
                      {followTimes
                        .filter((time) => playStyle.time.includes(time))
                        .join(",")}
                    </span>
                    에 게임을 즐기는 유저예요
                  </p>
                )}
                {/* 같은 팀 */}
                {favoriteTeam !== "없음" &&
                favoriteTeam === follow.user?.profile[0].favorite_team ? (
                  <p className="text-gray-500">
                    같은 팀{" "}
                    <span className="font-bold text-black">{favoriteTeam}</span>
                    을 좋아해요
                  </p>
                ) : null}
                {/* TODO: 같은 게임 성향(즐겜/빡겜) */}
                {/* TODO: 팔로우 로직 hook에 만들기 */}
                <button className="absolute py-2.5 px-9 bottom-[60px] rounded-full font-bold text-white bg-mint">
                  팔로우
                </button>
                <div className="absolute bottom-[22px] flex gap-[8px]">
                  {FollowingList.map((card, index) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 ${
                        cardIndex === index ? "bg-mint" : "bg-gray-400"
                      } rounded-full`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={() => handleClickArrow(true)}>
          <ArrowBtn width="24" height="42" />
        </button>
      </div>
      <NextStepButton
        isClickable={true}
        text="지브롤터 시작하기"
        onClick={handleSubmit}
      />
    </ProfileSettingContainer>
  );
}

export default FollowUser;
