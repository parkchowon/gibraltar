import Post from "../../home/_components/Post/Post";
import { useEffect, useRef } from "react";
import { getUserBookmark, getUserMedia, getUserPost } from "@/apis/post.api";
import { useInfiniteQuery } from "@tanstack/react-query";

function UserPost({ userId, type }: { userId: string; type: string | null }) {
  const loadMoreRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["userPost", userId, type],
      queryFn: ({ pageParam = 1 }) => {
        if (type === "media") {
          return getUserMedia(userId, pageParam);
        } else if (type === "bookmark") {
          return getUserBookmark(userId, pageParam);
        } else {
          return getUserPost(userId, pageParam);
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
    <div className="flex flex-col h-fit divide-y-2 divide-gray-300">
      {status === "pending" ? (
        <p>loading...</p>
      ) : data && data.pages.flatMap((page) => page).length === 0 ? (
        <p>아직 {type ? type : "포스트"}가 없어요</p>
      ) : (
        <>
          {data &&
            data.pages.map((page) => {
              return page?.map((post) => {
                return <Post key={post.id} post={post} />;
              });
            })}
        </>
      )}
      <div ref={loadMoreRef} className="h-5" />
      {isFetchingNextPage && <p>loading more...</p>}
    </div>
  );
}

export default UserPost;
