import { getFollower, getPostCount, getUser } from "@/apis/auth.api";
import UserStatus from "@/components/Status/UserStatus";
import { USER_STATUS } from "@/constants/status";
import { useAuth } from "@/contexts/auth.context";
import { useFollow } from "@/hooks/useUserFollow";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProfileEditModal from "./ProfileEdit/ProfileEditModal";
import ProfileLoading from "@/components/Loading/ProfileLoading";

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
  const [editClick, setEditClick] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("");

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

  useEffect(() => {
    if (data?.followerList) {
      const followerList = data.followerList;
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
      setButtonText(!!isFollowing ? "팔로잉 중" : "팔로우");
    }
  }, [data, data?.followerList]);

  // 본인일 시 프로필 편집 모달 오픈
  const handleEditClick = () => {
    setEditClick(true);
  };

  // 팔로우, 언팔로우 업데이트를 위한 mutation
  const { followMutation, unFollowMutation } = useFollow();

  if (!data || isPending) return <ProfileLoading />;

  // 팔로우 할 시
  const profileUser = data.profileUser;
  const postCount = data.postCount || 0;

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
          className="ml-auto h-[35px] w-max-[150px] px-3 lg:px-[15px] text-xs lg:text-sm truncate rounded-full bg-white border border-mainGray hover:brightness-95"
        >
          프로필 편집
        </button>
      );
    } else {
      return (
        <button
          onMouseOver={() => setButtonText(isFollowing ? "언팔로우" : "팔로우")}
          onMouseLeave={() =>
            setButtonText(isFollowing ? "팔로잉 중" : "팔로우")
          }
          onClick={() => handleFollowClick()}
          className={`${
            isFollowing
              ? "bg-transparent border-[1px] border-mainGray hover:bg-warning"
              : "bg-subGray border border-mainGray hover:bg-carrot"
          } ml-auto h-[35px] px-[15px] text-sm rounded-full `}
        >
          {buttonText}
        </button>
      );
    }
  };

  return (
    <div className="flex pt-10 px-1 gap-5 lg:pt-[50px] pb-[5.5%] lg:px-[70px] lg:gap-14">
      {editClick && profileUser && (
        <ProfileEditModal
          profileUser={profileUser}
          setEditClick={setEditClick}
        />
      )}
      <div className="relative w-14 h-14 lg:w-[120px] lg:h-[120px]">
        <Image
          alt="profile"
          fill
          src={profileUser ? profileUser.profile_url : ""}
          className="absolute rounded-full object-contain aspect-square"
        />
      </div>
      <div className="flex flex-col flex-grow gap-5 justify-between">
        <div className="flex">
          <div className="flex-grow">
            <p className="font-semibold">{profileUser?.nickname}</p>
            <p className="text-xs mb-1">{profileUser?.handle}</p>
            <p className="text-sm mb-3">
              {profileUser && profileUser.detail ? profileUser.detail.bio : ""}
            </p>
            <UserStatus status={status} intent={"page"} />
          </div>
          {buttonRender()}
        </div>
        <div className="flex gap-5 lg:gap-14 text-xs font-bold">
          <p>포스트 {postCount}</p>
          <p>팔로워 {followings}</p>
          <p>팔로우 {followers.length}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileBox;
