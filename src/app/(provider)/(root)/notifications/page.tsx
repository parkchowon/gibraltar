"use client";
import MainLayout from "@/components/Layout/MainLayout";
import RepostItem from "./_components/RepostItem";
import FollowItem from "./_components/FollowItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotification } from "@/apis/notification.api";
import { useAuth } from "@/contexts/auth.context";
import PostLoading from "@/components/Loading/PostLoading";
import { NotiType } from "@/types/notification";
import Post from "../home/_components/Post/Post";

function NotificationPage() {
  const { user } = useAuth();

  const { data, isPending, error } = useInfiniteQuery({
    queryKey: ["notificationList"],
    queryFn: ({ pageParam }: { pageParam: string }) => {
      if (user) {
        return getNotification(user.id, pageParam);
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 20) {
        return undefined;
      }
      return lastPage[lastPage.length - 1].created_at;
    },
    initialPageParam: new Date().toISOString(),
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
          data.pages &&
          data.pages.map((page) => {
            return page?.map((noti) => {
              return renderingNotificationItem(noti);
            });
          })}
      </div>
    </MainLayout>
  );
}

export default NotificationPage;
