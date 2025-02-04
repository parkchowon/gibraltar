import ProfileBtn from "@/components/ProfileBtn";
import Link from "next/link";
import React from "react";

function GroupParticipantItem({
  group,
  user,
  isRead,
}: {
  group: {
    id: string;
    title: string;
    mode: string;
  } | null;
  user: {
    nickname: string;
    profile_url: string;
    handle: string;
  } | null;
  isRead: boolean;
}) {
  return (
    <Link href="/group">
      <div
        className={`flex items-center w-full px-2 py-3 lg:px-[25px] lg:py-[15px] gap-6 ${
          isRead ? "bg-white" : "bg-subGray"
        }`}
      >
        <ProfileBtn
          profileUrl={user?.profile_url || ""}
          handle={user?.handle}
          intent={"post"}
        />
        <p className="text-sm lg:text-base text-black">
          <span className="font-semibold">{group?.title}</span>에{" "}
          <span className="font-bold">{user?.nickname}</span>이 참가하였습니다.
        </p>
      </div>
    </Link>
  );
}

export default GroupParticipantItem;
