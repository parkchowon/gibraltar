"use client";
import MainLayout from "@/components/Layout/MainLayout";
import RepostItem from "./_components/RepostItem";
import FollowItem from "./_components/FollowItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotification } from "@/apis/notification.api";
import { useAuth } from "@/contexts/auth.context";
import PostLoading from "@/components/Loading/PostLoading";
import { NotiType } from "@/types/notification.type";
import Post from "../home/_components/Post/Post";
import { useEffect, useRef } from "react";
import { groupBy } from "lodash";

function NotificationPage() {
  const { userData, isPending } = useAuth();
  const loadMoreRef = useRef(null);

  const {
    data,
    isPending: isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["notificationList", userData?.id],
    queryFn: ({ pageParam }: { pageParam: string }) => {
      if (userData) {
        return getNotification(userData.id, pageParam);
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 20) {
        return undefined;
      }
      return lastPage[lastPage.length - 1].created_at;
    },
    initialPageParam: new Date().toISOString(),
    enabled: !!userData,
  });
  // 모든 알림 배열
  const allNoti = data?.pages.flat() || [];

  // 타입별로 나눈 배열
  const groupByType = groupBy(allNoti, "type") as Record<string, NotiType[]>;

  // repost 배열을 post 별로 나눔
  const groupedReposts = groupBy(
    groupByType["repost"],
    "related_post_id"
  ) as Record<string, NotiType[]>;

  // like 배열을 post 별로 나눔
  const groupedLikes = groupBy(
    groupByType["like"],
    "related_post_id"
  ) as Record<string, NotiType[]>;

  // observer로 스크롤 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderingNotificationItem = (noti: NotiType) => {
    switch (noti.type) {
      case "repost":
        if (!noti.related_post_id) return;
        const postReposts = groupedReposts[noti.related_post_id];
        if (postReposts.length > 1) {
          if (
            postReposts[0].reacted_user?.nickname ===
            noti.reacted_user?.nickname
          ) {
            const reactedUser = postReposts.reduce(
              (acc, repost) => {
                if (repost.reacted_user) {
                  acc.nicknames.push(repost.reacted_user.nickname);
                  acc.profileUrls.push(repost.reacted_user.profile_url);
                  acc.userIds.push(repost.reacted_user_id);
                }
                return acc;
              },
              {
                nicknames: [] as string[],
                profileUrls: [] as string[],
                userIds: [] as string[],
              }
            );
            return <RepostItem notification={noti} reactedUser={reactedUser} />;
          }
          return;
        }
        return <RepostItem notification={noti} />;
      case "like":
        const postLikes = groupedLikes[noti.related_post_id || ""];
        if (postLikes.length > 1) {
          if (
            postLikes[0]?.reacted_user?.nickname === noti.reacted_user?.nickname
          ) {
            const reactedUser = postLikes.reduce(
              (acc, like) => {
                if (like.reacted_user) {
                  acc.nicknames.push(like.reacted_user?.nickname);
                  acc.profileUrls.push(like.reacted_user.profile_url);
                  acc.userIds.push(like.reacted_user_id);
                }
                return acc;
              },
              {
                nicknames: [] as string[],
                profileUrls: [] as string[],
                userIds: [] as string[],
              }
            );
            return <RepostItem notification={noti} reactedUser={reactedUser} />;
          }
          return;
        }
        return <RepostItem notification={noti} />;
      case "follow":
        return <FollowItem notification={noti} />;
      case "comment":
        if (noti.comment) return <Post post={noti.comment} />;
      case "quote":
        if (noti.quote) return <Post post={noti.quote} />;
      default:
        return <RepostItem notification={noti} />;
    }
  };

  if (isPending || isLoading)
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
      <div ref={loadMoreRef} className="h-5" />
      {isFetchingNextPage && <PostLoading />}
    </MainLayout>
  );
}

export default NotificationPage;
