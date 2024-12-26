import React, { useEffect, useState } from "react";
import ProfileBtn from "./ProfileBtn";
import { SearchUserType } from "@/types/search.type";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { checkFollow } from "@/apis/follow.api";
import { useAuth } from "@/contexts/auth.context";
import { useUserTagStore } from "@/stores/userTag.store";

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

  return (
    <div
      onClick={handleUserClick}
      className={`flex ${tag ? "pl-4 py-3 justify-center" : "px-10 py-4"} ${
        tag && order === selectedUser ? "bg-gray-100" : "bg-white"
      } items-center hover:bg-gray-100 cursor-pointer`}
    >
      <ProfileBtn
        profileUrl={user.profile_url}
        intent={"post"}
        type="click"
        handle={user.handle}
      />
      <div className="flex-grow ml-6 mr-8">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold">{user.nickname}</p>
          <p className="text-sm font-medium text-gray-500">{user.handle}</p>
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
        className={`${
          tag && "hidden"
        } px-6 py-2.5 text-sm ml-auto rounded-full flex-shrink-0 ${
          data
            ? "border border-gray-400 hover:bg-warning"
            : "bg-gray-300 hover:brightness-95"
        } `}
      >
        {btnText}
      </button>
    </div>
  );
}

export default UserItem;
