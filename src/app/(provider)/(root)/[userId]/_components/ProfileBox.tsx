import { getFollower, getUser } from "@/apis/auth.api";
import { useAuth } from "@/contexts/auth.context";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type followerType = {
  created_at: string;
  follower_id: string;
  following_id: string;
  id: number;
};

function ProfileBox({ countPost }: { countPost: number }) {
  const pathname = usePathname();
  const { user: loginUser } = useAuth();
  const userId = pathname.replace("/", "");
  const [followers, setFollowers] = useState<followerType[]>([]);
  const [followings, setFollowings] = useState<number>(0);

  const isMyProfile = loginUser && loginUser.id === userId;

  const { isPending, data } = useQuery({
    queryKey: ["profileData", userId],
    queryFn: async () => {
      const followerList = await getFollower(userId);
      const user = await getUser(userId);
      return { followerList, user };
    },
  });

  const followerList = data?.followerList;
  const user = data?.user;

  // TODO 팔로우, 언팔로우 기능 구현
  const buttonRender = () => {
    const isFollowing = followers.filter((follow) => {
      return follow.follower_id == user?.id;
    });

    if (isMyProfile) {
      return (
        <button className="ml-auto h-[35px] px-[15px] text-sm rounded-full bg-gray-50">
          프로필 편집
        </button>
      );
    } else {
      return (
        <button
          className={`${
            isFollowing.length
              ? "bg-transparent border-[1px] border-gray-400"
              : "bg-gray-50"
          } ml-auto h-[35px] px-[15px] text-sm rounded-full `}
        >
          {isFollowing.length ? "팔로잉" : "팔로우"}
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
    }
  }, [followerList]);

  if (isPending) return <p>loading...</p>;

  return (
    <div className="flex pt-[50px] pb-[68px] px-[95px]">
      <Image
        alt="profile"
        width={166}
        height={166}
        src={user ? user.profile_url : ""}
        className="rounded-full mr-[95px]"
      />
      <div className="flex-grow">
        <div className="flex mb-[52px] ">
          <div>
            <p className="font-semibold text-lg">{user?.nickname}</p>
            <p>{user?.handle}</p>
          </div>
          {buttonRender()}
        </div>
        <div className="flex gap-14 text-xs font-bold">
          <p>포스트 {countPost}</p>
          <p>팔로워 {followings}</p>
          <p>팔로우 {followers.length}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileBox;
