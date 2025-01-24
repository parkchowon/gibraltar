"use client";

import { getPost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post/Post";
import { useEffect, useRef, useState } from "react";
import TimeLineLoading from "@/components/Loading/TimeLineLoading";
import PostLoading from "@/components/Loading/PostLoading";
import EmptyState from "@/components/EmptyState";

function TimeLine() {
  const { userData } = useAuth();
  const loadMoreRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: userData ? ["timelineData", userData.id] : ["timelineData"],
      queryFn: ({ pageParam = null }: { pageParam: string | null }) => {
        return getPost(userData ? userData.id : null, pageParam);
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.length === 0) {
          return undefined;
        }
        const lastPost = lastPage[lastPage.length - 1];
        const lastTime = lastPost.timeline_at;
        return lastTime;
      },
      refetchInterval: 10000,
      initialPageParam: null,
      enabled: !!userData,
    });

  // pending이 200ms 이상일 때만 보여주기
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (status === "pending") {
      timer = setTimeout(() => {
        setIsLoading(true);
      }, 300);
    } else {
      setIsLoading(false);
    }

    return () => clearTimeout(timer);
  }, [status]);

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
    <>
      <div className="flex flex-col h-fit divide-y-[1px] divide-mainGray bg-white">
        {isLoading ? (
          <TimeLineLoading />
        ) : data && data.pages.flatMap((page) => page).length === 0 ? (
          <EmptyState type="포스트" />
        ) : (
          <>
            {data &&
              data.pages.map((page) =>
                page?.map((post) => {
                  return <Post key={post.id} post={post} />;
                })
              )}
          </>
        )}
        <div ref={loadMoreRef} style={{ height: "20px" }} />
        {isFetchingNextPage && <PostLoading />}
      </div>
    </>
  );
}

export default TimeLine;
