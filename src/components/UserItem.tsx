import React from "react";
import ProfileBtn from "./ProfileBtn";
import { SearchUserType } from "@/types/search.type";
import { useRouter } from "next/navigation";

function UserItem({ user }: { user: SearchUserType[number] }) {
  const router = useRouter();

  const handleUserClick = () => {
    router.push(`/${user.id}`);
  };

  return (
    <div
      onClick={handleUserClick}
      className="flex px-10 py-4 items-center hover:bg-gray-100 cursor-pointer"
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
        <p className="text-sm flex-grow h-fit font-medium text-black line-clamp-3">
          {user.user_profiles?.bio}
        </p>
      </div>
      {/* TODO: 팔로우 텍스트랑 로직 */}
      <button className="px-6 py-2.5 text-sm ml-auto rounded-full flex-shrink-0 bg-gray-300 hover:brightness-95">
        팔로우
      </button>
    </div>
  );
}

export default UserItem;
