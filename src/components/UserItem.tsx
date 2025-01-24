import React, { useEffect, useState } from "react";
import ProfileBtn from "./ProfileBtn";
import { SearchUserType } from "@/types/search.type";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { checkFollow } from "@/apis/follow.api";
import { useAuth } from "@/contexts/auth.context";
import { useUserTagStore } from "@/stores/userTag.store";
import { useFollow } from "@/hooks/useUserFollow";

function UserItem({
  user,
  tag,
  order,
}: {
  user: SearchUserType[number];
  tag?: boolean;
  order?: number;
}) {
  const router = useRouter();
  const { userData } = useAuth();
  const [btnText, setBtnText] = useState<string>("팔로우");

  const { followMutation, unFollowMutation } = useFollow();
  const { setSelectedHandle, selectedUser, setSelectedUser } =
    useUserTagStore();
  const { data, isPending } = useQuery({
    queryKey: ["userFollow", user.id],
    queryFn: () => {
      if (userData) {
        return checkFollow(userData.id, user.id);
      }
    },
    enabled: !!userData,
  });

  useEffect(() => {
    setBtnText(data ? "팔로잉" : "팔로우");
  }, [data]);

  const handleUserClick = () => {
    if (tag) {
      setSelectedHandle(user.handle);
    } else {
      router.push(`/${user.handle}`);
    }
  };

  // 팔로우/언팔로우 로직
  const handleFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (data) {
      unFollowMutation.mutate({
        userId: userData?.id || "",
        followingId: user.id,
      });
    } else {
      followMutation.mutate({
        userId: userData?.id || "",
        followingId: user.id,
      });
    }
  };

  return (
    <div
      onClick={handleUserClick}
      className={`flex ${
        tag ? "pl-4 py-3 justify-center" : "px-4 py-2 lg:px-10 lg:py-4"
      } ${
        tag && order === selectedUser ? "bg-gray-100" : "bg-white"
      } items-center hover:bg-gray-100 cursor-pointer gap-2`}
    >
      <ProfileBtn
        profileUrl={user.profile_url}
        intent={"post"}
        type="click"
        handle={user.handle}
      />
      <div className="flex-grow lg:ml-6 lg:mr-8">
        <div className="flex items-center gap-1.5 w-fit">
          <p className="font-semibold">{user.nickname}</p>
          <p className="text-sm font-medium text-gray-500 truncate">
            {user.handle}
          </p>
        </div>
        <p
          className={`text-sm flex-grow h-fit font-medium text-black ${
            tag ? "line-clamp-1" : "line-clamp-3"
          }`}
        >
          {user.user_profiles?.bio}
        </p>
      </div>
      <button
        onMouseOver={() => setBtnText(data ? "언팔로우" : "팔로우")}
        onMouseLeave={() => setBtnText(data ? "팔로잉" : "팔로우")}
        onClick={handleFollowClick}
        className={`${
          tag && "hidden"
        } px-4 lg:px-6 py-2.5 text-xs lg:text-sm ml-auto rounded-full flex-shrink-0 ${
          data
            ? "border border-gray-400 hover:bg-warning"
            : "bg-gray-300 hover:brightness-95"
        } `}
      >
        {isPending ? "로딩 중" : btnText}
      </button>
    </div>
  );
}

export default UserItem;
