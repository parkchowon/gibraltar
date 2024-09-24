import { getFollower, getUser } from "@/apis/auth.api";
import { useAuth } from "@/contexts/auth.context";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function ProfileBox({ countPost }: { countPost: number }) {
  const pathname = usePathname();
  const { user: loginUser, isInitialized } = useAuth();
  const userId = pathname.replace("/", "");
  const [followers, setFollowers] = useState<number>(0);
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

  useEffect(() => {
    if (followerList) {
      const follower = followerList.filter((follow) => {
        return follow.follower_id === userId;
      });

      setFollowers(follower ? follower.length : 0);
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
          {isMyProfile && (
            <button className="ml-auto h-[35px] px-[15px] text-sm rounded-full bg-gray-50">
              프로필 편집
            </button>
          )}
        </div>
        <div className="flex gap-14 text-xs font-bold">
          <p>포스트 {countPost}</p>
          <p>팔로워 {followings}</p>
          <p>팔로우 {followers}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileBox;
