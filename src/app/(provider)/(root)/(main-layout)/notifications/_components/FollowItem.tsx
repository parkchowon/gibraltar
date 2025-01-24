import { checkFollow } from "@/apis/follow.api";
import { useQuery } from "@tanstack/react-query";
import { NotificationType } from "@/types/notification.type";
import { useEffect, useState } from "react";
import Check from "@/assets/icons/check.svg";
import FollowItemLoading from "@/components/Loading/FollowItemLoading";
import { useFollow } from "@/hooks/useUserFollow";
import { useAuth } from "@/contexts/auth.context";
import ProfileBtn from "@/components/ProfileBtn";

function FollowItem({ notification }: { notification: NotificationType }) {
  const { user } = useAuth();
  const { data, isPending, refetch } = useQuery({
    queryKey: ["followCheck", notification.id],
    queryFn: () =>
      checkFollow(notification.user_id, notification.reacted_user_id),
  });

  const { followMutation, unFollowMutation } = useFollow();

  const [buttonText, setButtonText] = useState<string>("팔로우");
  useEffect(() => {
    setButtonText(data ? "팔로잉 중" : "팔로우");
  }, [data]);

  const handleFollowClick = () => {
    if (user && notification.reacted_user) {
      if (data) {
        unFollowMutation.mutate({
          userId: user.id,
          followingId: notification.reacted_user?.handle,
        });
      } else {
        followMutation.mutate({
          userId: user.id,
          followingId: notification.reacted_user?.handle,
        });
      }
      refetch();
    }
  };

  if (isPending) return <FollowItemLoading />;
  return (
    <div
      key={notification.id}
      className={`flex items-center w-full px-2 py-3 lg:px-[25px] lg:py-[15px] gap-6 ${
        notification.is_read ? "bg-white" : "bg-subGray"
      }`}
    >
      <ProfileBtn
        handle={notification.reacted_user?.handle}
        profileUrl={notification.reacted_user?.profile_url || ""}
      />
      <p className="text-sm lg:text-base">
        <span className="font-bold">
          {notification.reacted_user?.nickname || "undefined"}
        </span>{" "}
        님이 회원님을 팔로우하기 시작했습니다.
      </p>
      <button
        onMouseOver={() => setButtonText(data ? "언팔로우" : "팔로우")}
        onMouseLeave={() => setButtonText(data ? "팔로잉 중" : "팔로우")}
        onClick={handleFollowClick}
        className={`flex items-center gap-2 text-center text-xs lg:text-sm font-semibold px-3 lg:px-4 py-2.5 ml-auto truncate bg-subGray rounded-[10px] ${
          data ? "text-carrot" : "text-black"
        } ${
          !isPending && data
            ? "hover:bg-warning hover:text-white"
            : "hover:brightness-75"
        }`}
      >
        {buttonText}
        {buttonText === "팔로잉 중" && data && <Check width={15} />}
      </button>
    </div>
  );
}

export default FollowItem;
