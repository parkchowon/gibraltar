"use client";
import RepostItem from "./_components/RepostItem";
import FollowItem from "./_components/FollowItem";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getNotification, updateNotification } from "@/apis/notification.api";
import { useAuth } from "@/contexts/auth.context";
import PostLoading from "@/components/Loading/PostLoading";
import { NotificationType } from "@/types/notification.type";
import { useEffect, useRef, useState } from "react";
import { groupBy } from "lodash";
import { userDataReducer } from "@/utils/formatChange";
import { NOTIFICATION_SIZE } from "@/constants/post";
import TimeLineLoading from "@/components/Loading/TimeLineLoading";
import { useNotificationStore } from "@/stores/notification.store";
import GroupParticipantItem from "./_components/GroupParticipantItem";
import GroupPermissionItem from "./_components/GroupPermissionItem";
import Post from "../home/_components/Post/Post";

function NotificationPage() {
  const { userData, isPending } = useAuth();
  const { notiCount, putNotiCount } = useNotificationStore();
  // const [allNoti, setAllNoti] = useState<NotificationType[]>([]);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toISOString()
  );
  const loadMoreRef = useRef(null);

  const {
    data,
    isPending: isLoading,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["notificationList", userData?.id],
    queryFn: ({ pageParam }: { pageParam: string }) =>
      getNotification(userData?.id, notiCount ? currentTime : pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < NOTIFICATION_SIZE) {
        return undefined;
      }
      return lastPage[lastPage.length - 1].created_at;
    },
    initialPageParam: currentTime,
    enabled: !!userData,
  });

  // 새로고침 누르면 리패치
  const queryClient = useQueryClient();
  const handleRefetch = async () => {
    setCurrentTime(new Date().toISOString());
    await queryClient.invalidateQueries({
      queryKey: ["notificationList", userData?.id],
      refetchType: "all",
    });
    await refetch();
    putNotiCount(false);
  };

  // 모든 페이지의 알람 배열
  const allNoti = data?.pages.flat() || [];
  // 타입별로 나눈 배열
  const groupByType = groupBy(allNoti, "type") as Record<
    string,
    NotificationType[]
  >;

  // repost 배열을 post 별로 나눔
  const groupedReposts = groupBy(
    groupByType["repost"],
    "related_post_id"
  ) as Record<string, NotificationType[]>;

  // like 배열을 post 별로 나눔
  const groupedLikes = groupBy(
    groupByType["like"],
    "related_post_id"
  ) as Record<string, NotificationType[]>;

  // 알림 페이지에 들어왔을때 현재 불러온 알림들을 읽음 처리하는 로직
  useEffect(() => {
    if (userData) {
      updateNotification(userData.id);
    }
  }, []);

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

  const renderingNotificationItem = (noti: NotificationType) => {
    switch (noti.type) {
      case "repost":
        if (!noti.related_post_id) return;
        const postReposts = groupedReposts[noti.related_post_id];
        if (postReposts && postReposts.length > 1) {
          if (
            postReposts[0].reacted_user?.nickname ===
            noti.reacted_user?.nickname
          ) {
            const reactedUser = userDataReducer(postReposts);
            return <RepostItem notification={noti} reactedUser={reactedUser} />;
          }
          return;
        }
        return <RepostItem notification={noti} />;
      case "like":
        const postLikes = groupedLikes[noti.related_post_id || ""];
        if (postLikes && postLikes.length > 1) {
          if (
            postLikes[0]?.reacted_user?.nickname === noti.reacted_user?.nickname
          ) {
            const reactedUser = userDataReducer(postLikes);
            return <RepostItem notification={noti} reactedUser={reactedUser} />;
          }
          return;
        }
        return <RepostItem notification={noti} />;
      case "follow":
        return <FollowItem notification={noti} />;
      case "comment":
        if (noti.comment && !noti.comment.is_deleted)
          return <Post post={noti.comment} />;
        else return;
      case "quote":
        if (noti.quote && !noti.quote.is_deleted)
          return <Post post={noti.quote} />;
        else return;
      case "groupJoin":
        return (
          <GroupParticipantItem
            group={noti.group}
            user={noti.reacted_user}
            isRead={noti.is_read}
          />
        );
      case "groupPermission":
        return (
          <GroupPermissionItem
            group={noti.group}
            user={noti.reacted_user}
            isRead={noti.is_read}
          />
        );
      default:
        return <RepostItem notification={noti} />;
    }
  };

  if (isPending || isLoading)
    return (
      <>
        <TimeLineLoading />
      </>
    );

  return (
    <>
      {notiCount && (
        <button
          onClick={handleRefetch}
          className="w-full border-b h-12 border-mainGray bg-white z-20 hover:bg-subGray"
        >
          새로운 알림
        </button>
      )}
      <div className="w-full divide-y-[1px] divide-gray-300">
        {data &&
          data.pages &&
          data.pages.map((page) => {
            return page?.map((noti) => {
              return <div key={noti.id}>{renderingNotificationItem(noti)}</div>;
            });
          })}
      </div>
      <div ref={loadMoreRef} className="h-5" />
      {isFetchingNextPage && <PostLoading />}
    </>
  );
}

export default NotificationPage;
