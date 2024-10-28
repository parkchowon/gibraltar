"use client";

import { getPost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post/Post";
import { useEffect, useRef, useState } from "react";
import TimeLineLoading from "@/components/Loading/TimeLineLoading";

function TimeLine() {
  const { userData } = useAuth();
  const loadMoreRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: userData ? ["timelineData", userData.id] : ["timelineData"],
      queryFn: ({ pageParam = 1 }) => {
        if (userData) {
          return getPost(userData.id, pageParam);
        }
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length === 0) {
          return undefined;
        }

        return allPages.length + 1;
      },
      refetchInterval: 10000,
      initialPageParam: 1,
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
    <div className="flex flex-col h-fit pt-[77px] divide-y-2 divide-gray-300 bg-gray-300">
      {isLoading ? (
        <TimeLineLoading />
      ) : data && data.pages.flatMap((page) => page).length === 0 ? (
        // TODO: 팔로한 유저가 없을 시 보여주는 화면
        <p>아직 포스트가 없습니다.</p>
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
      {isFetchingNextPage && <p>loading more...</p>}
    </div>
  );
}

export default TimeLine;
