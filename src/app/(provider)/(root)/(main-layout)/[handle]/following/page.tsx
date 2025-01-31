"use client";
import { getFollowing } from "@/apis/follow.api";
import PostLoading from "@/components/Loading/PostLoading";
import UserItem from "@/components/UserItem";
import { SearchUserType } from "@/types/search.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

function FollowingPage({ params }: { params: { handle: string } }) {
  const handle = decodeURIComponent(params.handle);
  const loadMoreRef = useRef(null);

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["followingList", handle],
      queryFn: ({ pageParam = 1 }): Promise<SearchUserType> =>
        getFollowing(handle, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length === 0) return undefined;
        return allPages.length + 1;
      },
      initialPageParam: 1,
      enabled: !!handle,
    });

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
    <div className="divide-y-[1px] divide-mainGray">
      {data &&
        data.pages.map((page) => {
          return page.map((user) => {
            return <UserItem key={user.id} user={user} />;
          });
        })}
      <div ref={loadMoreRef} style={{ height: "20px" }} />
      {isFetchingNextPage && <PostLoading />}
    </div>
  );
}

export default FollowingPage;
