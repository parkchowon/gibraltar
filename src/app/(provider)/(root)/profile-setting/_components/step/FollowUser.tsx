import { getRecommendedUsers } from "@/apis/profile.api";
import { useAuth } from "@/contexts/auth.context";
import { useProfileStore } from "@/stores/profile.store";
import { useQuery } from "@tanstack/react-query";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";
import SearchingPage from "../SearchingPage";

function FollowUser() {
  const handleSubmit = () => {};
  const { user } = useAuth();
  const { bio, favoriteTeam, playChamps, playStyle } = useProfileStore();

  // TODO supabase 취향? 테이블에서 비슷한 유저 찾아오기

  const { isPending, data: FollowingList } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: () => {
      if (user) {
        const profile = {
          userId: user.id,
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

  if (isPending) {
    return <SearchingPage />;
  }

  if (!FollowingList) {
    return <p>이런! 일치하는 계정이 없어요!</p>;
  }

  return (
    <ProfileSettingContainer
      title={`나와 공통점이 있는 계정을\n${
        FollowingList ? FollowingList.length : 0
      }개 찾았어요!`}
    >
      <div>
        {FollowingList.map((follow, idx) => {
          return <div key={idx}>{follow.user?.nickname}</div>;
        })}
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
