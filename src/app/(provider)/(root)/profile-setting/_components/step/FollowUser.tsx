import { getRecommendedUsers } from "@/apis/profile.api";
import ArrowBtn from "@/assets/icons/arrow_head.svg";
import { useAuth } from "@/contexts/auth.context";
import { useProfileStore } from "@/stores/profile.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";
import SearchingPage from "../SearchingPage";
import { useFollow } from "@/hooks/useUserFollow";
import ProfileBtn from "@/components/ProfileBtn";
import RandomUser from "../RandomUser";
import { useProfileUpdateMutation } from "@/hooks/userProfileMutation";
import LogoLoading from "@/components/Loading/LogoLoading";

function FollowUser() {
  const [cardIndex, setCardIndex] = useState<number>(0);

  const { userData } = useAuth();
  const { bio, favoriteTeam, playChamps, playStyle, nickname } =
    useProfileStore();

  const profile = {
    userId: userData?.id || "",
    bio: bio,
    playStyle: playStyle,
    mainChamps: playChamps.MainChamps,
    playChamps: playChamps.selectedChamps,
    favoriteTeam: favoriteTeam,
  };

  const mutation = useProfileUpdateMutation();
  const handleSubmit = async () => {
    mutation.mutate(profile);
  };

  const { followMutation, unFollowMutation } = useFollow();

  const {
    isPending,
    data: FollowingList,
    refetch,
  } = useQuery({
    queryKey: ["recommendedUsers", userData?.id],
    queryFn: () => {
      if (userData) {
        return getRecommendedUsers(profile);
      }
    },
    enabled: !!userData,
  });

  // 카드 넘기는 버튼 누를 시
  const handleClickArrow = (state: boolean) => {
    if (state && FollowingList && cardIndex !== FollowingList.length - 1) {
      setCardIndex(cardIndex + 1);
    } else if (!state && cardIndex !== 0) {
      setCardIndex(cardIndex - 1);
    }
  };

  // 팔로우, 언팔로우 버튼
  const handleFollowClick = async (
    idx: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (FollowingList && userData && FollowingList[idx].user) {
      if (FollowingList[idx].isFollowing) {
        await unFollowMutation.mutateAsync({
          userId: userData.id,
          followingId: FollowingList[idx].user.id,
        });
      } else {
        await followMutation.mutateAsync({
          userId: userData.id,
          followingId: FollowingList[idx].user.id,
        });
      }
      refetch();
    }
  };

  if (isPending || !FollowingList) {
    return <SearchingPage />;
  }

  // 추천 유저 알고리즘에 결과가 없을 경우
  if (FollowingList?.length === 0) {
    return (
      <ProfileSettingContainer
        title="현재 맞는 유저를 찾지 못했어요"
        sub="그 대신 이런 유저들은 어떤가요?"
      >
        <RandomUser profile={profile} />
        <NextStepButton onClick={async () => {}} />
      </ProfileSettingContainer>
    );
  }

  return (
    <>
      {mutation.isPending && (
        <div className="fixed inset-0 w-full h-screen">
          <LogoLoading />
        </div>
      )}
      <ProfileSettingContainer
        title={`나와 공통점이 있는 계정을\n${
          FollowingList ? FollowingList.length : 0
        }개 찾았어요!`}
      >
        <div className="flex justify-center lg:gap-[30px] gap-4 lg:mb-[68px] mb-10">
          <button onClick={() => handleClickArrow(false)}>
            <ArrowBtn
              width="24"
              height="42"
              style={{ transform: "rotate(180deg)" }}
              className="lg:w-6 lg:h-[42px] w-4 h-6"
            />
          </button>
          <div className="relative lg:w-[404px] w-[280px] lg:h-[463px] h-72">
            {FollowingList &&
              FollowingList.length > 0 &&
              FollowingList.map((follow, idx) => {
                const followModes = follow.user?.profile?.play_mode as string[];
                const followTimes = follow.user?.profile?.play_time as string[];
                return (
                  <div
                    key={`${follow.user?.id}${follow.score}`}
                    className={`absolute flex-col lg:w-[404px] w-[280px] lg:h-[463px] h-72 items-center bg-white top-0 left-0 lg:pt-[35px] pt-4 px-6 lg:pb-[22px] pb-3 border border-black rounded-2xl ${
                      idx === cardIndex ? "flex" : "hidden"
                    }`}
                  >
                    <ProfileBtn
                      profileUrl={follow.user?.profile_url || ""}
                      intent={"card"}
                      type="non-click"
                    />
                    <p className="lg:text-lg text-base lg:mt-3.5 mt-1 font-bold">
                      {follow.user?.nickname}
                    </p>
                    <p className="text-gray-400 text-xs lg:text-base lg:mb-1">
                      {follow.user?.handle}
                    </p>
                    <p className=" w-full lg:h-12 mb-1.5 text-xs lg:text-base text-center line-clamp-1 lg:line-clamp-2">
                      {follow.user?.profile?.bio}
                    </p>

                    {/* 같은 게임 모드 */}
                    <p className="text-gray-500 w-full text-sm lg:text-base">
                      &middot; {nickname !== "" ? nickname : userData?.nickname}
                      님처럼{" "}
                      <span className="font-bold text-black">
                        {followModes
                          .filter((mode) => playStyle.mode?.includes(mode))
                          .join(",")}
                      </span>
                      을 즐기는 유저예요
                    </p>
                    {/* 같은 시간대 */}
                    {followTimes && followTimes.length > 0 && (
                      <p className="text-gray-500 w-full text-sm lg:text-base">
                        &middot; 같은{" "}
                        <span className="font-bold text-black">
                          {followTimes
                            .filter((time) => playStyle.time?.includes(time))
                            .join(",")}
                        </span>
                        에 게임을 즐기는 유저예요
                      </p>
                    )}
                    {/* 같은 팀 */}
                    {favoriteTeam !== "없음" &&
                    favoriteTeam === follow.user?.profile?.favorite_team ? (
                      <p className="text-gray-500 w-full text-sm lg:text-base">
                        &middot; 같은 팀{" "}
                        <span className="font-bold text-black">
                          {favoriteTeam}
                        </span>
                        을 좋아해요
                      </p>
                    ) : null}
                    <button
                      onClick={(e) => handleFollowClick(idx, e)}
                      className="absolute lg:py-2.5 py-1 lg:px-9 px-3 lg:bottom-[60px] bottom-5 rounded-full font-bold text-white bg-mint text-sm lg:text-base"
                    >
                      {follow.isFollowing ? "언팔로우" : "팔로우"}
                    </button>
                    <div className="absolute lg:bottom-[22px] bottom-2 flex gap-[8px]">
                      {FollowingList &&
                        FollowingList.map((card, index) => (
                          <div
                            key={card.user?.id}
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
            <ArrowBtn
              width="24"
              height="42"
              className="lg:w-6 lg:h-[42px] w-4 h-6"
            />
          </button>
        </div>
        <NextStepButton
          isClickable={true}
          text="지브롤터 시작하기"
          onClick={handleSubmit}
        />
      </ProfileSettingContainer>
    </>
  );
}

export default FollowUser;
