import { getFollower, getPostCount, getUser } from "@/apis/auth.api";
import UserStatus from "@/components/Status/UserStatus";
import { USER_STATUS } from "@/constants/status";
import { useAuth } from "@/contexts/auth.context";
import { useFollow } from "@/hooks/useUserFollow";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

type followerType = {
  created_at: string;
  follower_id: string;
  following_id: string;
  id: number;
};

function ProfileBox({ userId }: { userId: string }) {
  const { user: loginUser } = useAuth();
  const [followers, setFollowers] = useState<followerType[]>([]);
  const [followings, setFollowings] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>();

  // 지금 프로필 페이지가 내 페이지인지
  const isMyProfile = loginUser && loginUser.id === userId;

  // 프로필 페이지에 필요한 팔로워리스트, 유저정보, post개수를 fetch
  const { isPending, data } = useQuery({
    queryKey: ["profileData", userId],
    queryFn: async () => {
      const followerList = await getFollower(userId);
      const profileUser = await getUser(userId);
      const postCount = await getPostCount(userId);
      return { followerList, profileUser, postCount };
    },
  });

  // 본인일 시 프로필 편집 로직
  const handleEditClick = () => {
    // TODO: 프로필 편집
  };

  // 팔로우, 언팔로우 업데이트를 위한 mutation
  const { followMutation, unFollowMutation } = useFollow();

  // 팔로우 할 시
  const followerList = data?.followerList;
  const profileUser = data?.profileUser;
  const postCount = data?.postCount || 0;

  const status = {
    state: profileUser?.status || "상태 표시 안 함",
    color:
      USER_STATUS.find((state) => state.state === profileUser?.status)?.color ||
      "#D4D4D4",
  };

  // 팔로우/언팔로우 로직
  const handleFollowClick = () => {
    if (isFollowing && loginUser) {
      unFollowMutation.mutate({ userId: loginUser.id, followingId: userId });
    } else if (!isFollowing && loginUser) {
      followMutation.mutate({ userId: loginUser.id, followingId: userId });
    }
  };

  const buttonRender = () => {
    if (isMyProfile) {
      return (
        <button
          onClick={handleEditClick}
          className="ml-auto h-[35px] px-[15px] text-sm rounded-full bg-gray-50"
        >
          프로필 편집
        </button>
      );
    } else {
      return (
        <button
          onClick={() => handleFollowClick()}
          className={`${
            isFollowing
              ? "bg-transparent border-[1px] border-gray-400 hover:bg-warning"
              : "bg-gray-50"
          } ml-auto h-[35px] px-[15px] text-sm rounded-full `}
        >
          {isFollowing ? "팔로잉" : "팔로우"}
        </button>
      );
    }
  };

  useEffect(() => {
    if (followerList) {
      const follower = followerList.filter((follow) => {
        return follow.follower_id === userId;
      });

      setFollowers(follower);
      setFollowings(
        follower ? followerList.length - follower.length : followerList.length
      );
      // 지금 프로필 페이지의 팔로워중에 본인이 있는지에 대해
      const isFollowing = followerList.find(
        (follower) => loginUser && follower.follower_id === loginUser.id
      );
      setIsFollowing(!!isFollowing);
    }
  }, [data, followerList]);

  if (isPending) return <p>loading...</p>;

  return (
    <div className="flex pt-[50px] pb-[68px] px-[95px]">
      <Image
        alt="profile"
        width={166}
        height={166}
        src={profileUser ? profileUser.profile_url : ""}
        className="rounded-full mr-[95px]"
      />
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex">
          <div>
            <p className="font-semibold text-lg">{profileUser?.nickname}</p>
            <p className="text-sm mb-2">{profileUser?.handle}</p>
            <UserStatus status={status} intent={"page"} />
          </div>
          {buttonRender()}
        </div>
        <div className="flex gap-14 text-xs font-bold">
          <p>포스트 {postCount}</p>
          <p>팔로워 {followings}</p>
          <p>팔로우 {followers.length}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileBox;
