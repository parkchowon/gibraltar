"use client";
import MainLayout from "@/components/Layout/MainLayout";
import GroupSearchBox from "./_components/GroupSearchBox";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getGroup, getUserGroup } from "@/apis/group.api";
import { useAuth } from "@/contexts/auth.context";
import { GroupStatusType, GroupType } from "@/types/group.type";
import GroupItem from "./_components/GroupItem";
import PostLoading from "@/components/Loading/PostLoading";
import { useEffect, useRef } from "react";
import { useGroupStore } from "@/stores/group.store";

function GroupPage() {
  const { user } = useAuth();
  const loadMoreRef = useRef(null);
  const { putStatus, putParticipantUser } = useGroupStore();

  const {
    data: groups,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["groupList", user?.id],
    queryFn: ({ pageParam = 1 }): Promise<GroupType> => getGroup(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!user,
  });

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["groupStatus", user?.id],
    queryFn: (): Promise<GroupStatusType> => getUserGroup(user?.id || ""),
    enabled: !!user,
  });

  useEffect(() => {
    if (data) {
      putStatus(data.status);
      if (data.status === "모집") {
        data.data?.map((parti) => {
          if (parti.users) {
            putParticipantUser(parti.users);
          }
        });
      }
    }
  }, [data]);

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

  return (
    <MainLayout>
      <GroupSearchBox />
      {isPending && isLoading && <PostLoading />}
      <div className="flex flex-col gap-3 py-10">
        {groups &&
          groups.pages.map((page) => {
            return page.map((group) => {
              return (
                <GroupItem
                  key={group.id}
                  group={group}
                  userId={user?.id ?? ""}
                />
              );
            });
          })}
      </div>
      <div ref={loadMoreRef} style={{ height: "20px" }} />
      {isFetchingNextPage && <PostLoading />}
    </MainLayout>
  );
}

export default GroupPage;
