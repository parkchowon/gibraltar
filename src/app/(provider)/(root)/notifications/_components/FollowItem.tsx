import { checkFollow } from "@/apis/follow.api";
import { useQuery } from "@tanstack/react-query";
import ProfileBtn from "../../../../../components/ProfileBtn";
import { NotificationType } from "@/types/notification.type";
import { useEffect, useState } from "react";
import Check from "@/assets/icons/check.svg";

function FollowItem({ notification }: { notification: NotificationType }) {
  const { data, isPending } = useQuery({
    queryKey: ["followCheck", notification.id],
    queryFn: () =>
      checkFollow(notification.user_id, notification.reacted_user_id),
  });

  const [buttonText, setButtonText] = useState<string>("팔로우");
  useEffect(() => {
    setButtonText(data ? "팔로잉 중" : "팔로우");
  }, [data]);
  if (isPending)
    return (
      <div className="flex items-center w-full px-[25px] py-[15px] gap-6"></div>
    );

  return (
    <div
      key={notification.id}
      className="flex items-center w-full px-[25px] py-[15px] gap-6"
    >
      <ProfileBtn
        handle={notification.reacted_user?.handle}
        profileUrl={notification.reacted_user?.profile_url || ""}
      />
      <p>
        <span className="font-bold">
          {notification.reacted_user?.nickname || "undefined"}
        </span>{" "}
        님이 회원님을 팔로우하기 시작했습니다.
      </p>
      {/* TODO: 팔로우 hook 가지고 와서 버튼 누르면 팔로우랑 언팔로우 되게 */}
      <button
        onMouseOver={() => setButtonText(data ? "언팔로우" : "팔로우")}
        onMouseLeave={() => setButtonText(data ? "팔로잉 중" : "팔로우")}
        className={`flex items-center gap-2 text-center text-sm font-semibold px-4 py-2.5 ml-auto bg-subGray rounded-[10px] ${
          data ? "text-carrot" : "text-black"
        } ${
          !isPending && data
            ? "hover:bg-warning hover:text-white"
            : "hover:brightness-75"
        }`}
      >
        {buttonText}
        {buttonText === "팔로잉 중" && data && <Check />}
      </button>
    </div>
  );
}

export default FollowItem;
