import React from "react";
import ProfileBtn from "./ProfileBtn";
import { SearchUserType } from "@/types/search.type";

function UserItem({ user }: { user: SearchUserType[number] }) {
  //  userId, profileUrl, nickname, handle, content, follow여부
  return (
    <div className="flex py-1">
      <ProfileBtn
        profileUrl={user.profile_url}
        intent={"post"}
        type="click"
        userId={user.id}
      />
      <div>
        <div className="flex">
          <p>{user.nickname}</p>
          <p>{user.handle}</p>
        </div>
        <p>{user.user_profiles?.bio}</p>
      </div>
      <button className="ml-auto">팔로우</button>
    </div>
  );
}

export default UserItem;
