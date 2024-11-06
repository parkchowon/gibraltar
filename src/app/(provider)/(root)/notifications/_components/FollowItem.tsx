import { checkFollow } from "@/apis/follow.api";
import { NotiType } from "@/types/notification";
import { useQuery } from "@tanstack/react-query";
import ProfileBtn from "../../../../../components/ProfileBtn";

function FollowItem({ notification }: { notification: NotiType }) {
  const { data, isPending } = useQuery({
    queryKey: ["followCheck"],
    queryFn: () =>
      checkFollow(notification.reacted_user_id, notification.user_id),
  });

  return (
    <div className="flex items-center w-full px-[25px] py-[15px] gap-6">
      <ProfileBtn
        userId={notification.reacted_user_id}
        profileUrl={notification.reacted_user_profile_url}
      />
      <p>
        <span className="font-bold">{notification.reacted_user_nickname}</span>{" "}
        님이 회원님을 팔로우하기 시작했습니다.
      </p>
      {/* TODO: 팔로우 hook 가지고 와서 버튼 누르면 팔로우랑 언팔로우 되게 */}
      <button className="text-sm font-semibold px-9 py-2.5 ml-auto bg-gray-50 rounded-[10px]">
        {isPending ? "" : data ? "팔로잉" : "팔로우"}
      </button>
    </div>
  );
}

export default FollowItem;
