"use client";
import MainLayout from "@/components/Layout/MainLayout";
import RepostItem from "./_components/RepostItem";
import FollowItem from "./_components/FollowItem";
import { useQuery } from "@tanstack/react-query";
import { getNotification } from "@/apis/notification.api";
import { useAuth } from "@/contexts/auth.context";
import PostLoading from "@/components/Loading/PostLoading";
import { NotiType } from "@/types/notification";

function NotificationPage() {
  const { user } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: ["notificationList", user?.id],
    queryFn: () => getNotification(user?.id),
    initialData: [],
  });

  if (error) {
    console.log(error);
  }

  const renderingNotificationItem = (noti: NotiType) => {
    switch (noti.type) {
      case "repost":
        return <RepostItem notification={noti} />;
      case "like":
        return <RepostItem notification={noti} />;
      case "follow":
        return <FollowItem />;
      default:
        return <RepostItem notification={noti} />;
    }
  };

  if (isPending)
    return (
      <MainLayout>
        <PostLoading />
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="w-full h-[77px] bg-gray-300" />
      <div className="px-6 w-full divide-y-[1px] divide-gray-300">
        {data &&
          data.map((item) => {
            console.log(item);
            return renderingNotificationItem(item);
          })}
      </div>
    </MainLayout>
  );
}

export default NotificationPage;
