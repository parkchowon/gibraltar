import { NotiType } from "@/types/notification";
import React from "react";
import ProfileBtn from "@/components/ProfileBtn";
type RepostItemProps = {
  notification: NotiType;
  nicknames?: (string | undefined)[];
};

function RepostItem({ notification, nicknames }: RepostItemProps) {
  return (
    <div
      key={notification.id}
      className="flex w-full px-[25px] py-[15px] gap-6"
    >
      <ProfileBtn
        userId={notification.reacted_user_id}
        profileUrl={notification.reacted_user_profile_url}
      />
      <div className="flex flex-col flex-grow gap-2.5">
        <p className="text-base">
          <span className="font-bold">
            {nicknames
              ? nicknames.map((nick) => nick)
              : notification.reacted_user_nickname}
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
