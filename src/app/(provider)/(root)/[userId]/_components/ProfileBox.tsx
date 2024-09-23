import { getFollower, getUser } from "@/apis/auth.api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function ProfileBox() {
  const pathname = usePathname();
  const userId = pathname.replace("/", "");
  const [followers, setFollowers] = useState<number>(0);
  const [followings, setFollowings] = useState<number>(0);

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
    <div className="flex">
      <Image
        alt="profile"
        width={166}
        height={166}
        src={user ? user.profile_url : ""}
        className="rounded-full"
      />
      <div>
        <div className="flex">
          <div>
            <p>{user?.nickname}</p>
            <p>{user?.email}</p>
          </div>
          <button>프로필 편집</button>
        </div>
        <div className="flex">
          <p>포스트</p>
          <p></p>
          <p>팔로워</p>
          <p>{followings}</p>
          <p>팔로우</p>
          <p>{followers}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileBox;
