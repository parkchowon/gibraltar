import ProfileBtn from "@/components/ProfileBtn";
import Link from "next/link";
import React from "react";

function GroupPermissionItem({
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
        className={`flex items-center w-full px-[25px] py-[15px] gap-6 ${
          isRead ? "bg-white" : "bg-subGray"
        }`}
      >
        <ProfileBtn
          profileUrl={user?.profile_url || ""}
          handle={user?.handle}
          intent={"post"}
        />
        <p>
          <span className="font-bold">{user?.nickname}</span>님이{" "}
          <span className="font-semibold">{group?.title}</span>에 참가를
          확인하였습니다.
        </p>
      </div>
    </Link>
  );
}

export default GroupPermissionItem;
