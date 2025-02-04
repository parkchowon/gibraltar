import { NotificationType } from "@/types/notification.type";
import React from "react";
import ProfileBtn from "@/components/ProfileBtn";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import NotificationProfile from "./NotificationProfile";
import Repost from "@/assets/icons/post_repeat.svg";
import Like from "@/assets/icons/post_heart.svg";

type RepostItemProps = {
  notification: NotificationType;
  reactedUser?: {
    nicknames: string[];
    profileUrls: string[];
    handles: string[];
  };
};

function RepostItem({ notification, reactedUser }: RepostItemProps) {
  const router = useRouter();
  const { userData } = useAuth();
  const reactionCount = reactedUser?.nicknames.length;

  const nicknames = reactedUser
    ? reactedUser?.nicknames.length < 5
      ? reactedUser?.nicknames.join(", ")
      : `${reactedUser?.nicknames.slice(0, 4).join(", ")}님 외 ${
          reactionCount ? reactionCount - 4 : 0
        }명`
    : false;

  // 알람 클릭
  const handleNotiClick = () => {
    router.push(`/${userData?.handle}/post/${notification.related_post_id}`);
  };

  return (
    <div
      key={notification.id}
      onClick={handleNotiClick}
      className={`flex w-full px-2 lg:px-[25px] py-3 lg:py-[15px] gap-6 text-left cursor-pointer ${
        notification.is_read ? "bg-white" : "bg-subGray"
      }`}
    >
      {reactionCount ? (
        <NotificationProfile
          reactionCount={reactionCount}
          profileUrls={reactedUser.profileUrls}
          handles={reactedUser.handles}
        />
      ) : (
        <ProfileBtn
          handle={notification.reacted_user?.handle}
          profileUrl={
            notification.reacted_user?.profile_url || "/home_line.svg"
          }
        />
      )}
      <div className="flex flex-col flex-grow gap-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-[15px] h-[15px] min-[15px]:`}>
            {notification.type === "repost" ? (
              <Repost width={15} height={15} style={{ color: "#FC7B3D" }} />
            ) : (
              <Like
                width={15}
                height={15}
                style={{ color: "#3E97B2", fill: "#3E97B2" }}
              />
            )}
          </div>
          <p className="text-sm lg:text-base text-black">
            <span className="font-bold text-black">
              {nicknames ? nicknames : notification.reacted_user?.nickname}
            </span>{" "}
            님이 회원님의 포스트를
            {notification.type === "repost"
              ? " 재게시 했습"
              : " 마음에 들어 합"}
            니다.
          </p>
        </div>
        <p className="text-sm lg:text-base line-clamp-2 text-gray-400">
          {notification.related_post?.content}
        </p>
      </div>
    </div>
  );
}

export default RepostItem;
