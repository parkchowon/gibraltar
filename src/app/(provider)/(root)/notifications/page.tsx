"use client";
import MainLayout from "@/components/Layout/MainLayout";
import RepostItem from "./_components/RepostItem";
import FollowItem from "./_components/FollowItem";
import { useQuery } from "@tanstack/react-query";
import { getNotification } from "@/apis/notification.api";
import { useAuth } from "@/contexts/auth.context";
import PostLoading from "@/components/Loading/PostLoading";
import { NotiType } from "@/types/notification";
import Post from "../home/_components/Post/Post";

function NotificationPage() {
  const { user } = useAuth();

  // TODO: infinityQuery로 무한스크롤링 로직으로 refactoring하기
  const { data, isPending, error } = useQuery({
    queryKey: ["notificationList"],
    queryFn: () => {
      if (user) {
        return getNotification(user.id);
      }
    },
  });

  if (error) {
    console.log(error);
  }

  // TODO: 같은 post에 여러명 겹치면 겹쳐지게 하는 로직 작성..
  const renderingNotificationItem = (noti: NotiType) => {
    switch (noti.type) {
      case "repost":
        return <RepostItem notification={noti} />;
      case "like":
        return <RepostItem notification={noti} />;
      case "follow":
        return <FollowItem notification={noti} />;
      case "comment":
        if (noti.comment) return <Post post={noti.comment} />;
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
