import ProfileBtn from "@/components/ProfileBtn";
import { ParticipantUser } from "@/types/group.type";
import React from "react";

function ParticipantUserItem({
  user,
}: {
  user: ParticipantUser[number]["users"];
}) {
  if (user)
    return (
      <div className="flex w-full items-center bg-white border border-mainGray rounded-xl px-2 py-1">
        <ProfileBtn
          profileUrl={user.profile_url}
          handle={user.handle}
          intent={"post"}
        />
        <div className="ml-2">
          <p className="font-semibold">{user.nickname}</p>
          <p className="text-sm text-mainGray">{user.handle}</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="w-fit h-fit px-2 py-1 text-mainGray border text-sm border-mainGray rounded-full">
            거절
          </button>
          <button className="w-fit h-fit px-2 py-1 text-white bg-carrot border border-carrot text-sm rounded-full">
            수락
          </button>
        </div>
      </div>
    );
}

export default ParticipantUserItem;
