import { NotiType } from "@/types/notification";
import Image from "next/image";
import React from "react";

function RepostItem({ notification }: { notification: NotiType }) {
  return (
    <div
      key={notification.id}
      className="flex w-full px-[25px] py-[15px] gap-6"
    >
      <div className="relative w-[46px] h-[46px] rounded-full bg-gray-50 flex-shrink-0">
        <Image
          src={notification.reacted_user_profile_url}
          alt="profile image"
          fill
          className="absolute object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col flex-grow gap-2.5">
        <p className="text-base">
          <span className="font-bold">
            {notification.reacted_user_nickname}
          </span>{" "}
          님이 회원님의 포스트를
          {notification.type === "repost" ? " 재게시 했습" : " 마음에 들어 합"}
          니다.
        </p>
        <p className=" line-clamp-2 text-gray-400">
          {notification.related_post_content}
        </p>
      </div>
    </div>
  );
}

export default RepostItem;
