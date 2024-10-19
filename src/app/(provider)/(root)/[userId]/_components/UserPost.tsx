import Post from "../../home/_components/Post";
import { useEffect, useRef } from "react";
import { getUserPost } from "@/apis/post.api";
import { useInfiniteQuery } from "@tanstack/react-query";

function UserPost({ userId }: { userId: string }) {
  const loadMoreRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["userPost", userId],
      queryFn: ({ pageParam = 1 }) => {
        return getUserPost(userId, pageParam);
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
      {data?.pages.map((page) => {
        return page?.map((post) => {
          return <Post key={post.id} post={post} />;
        });
      })}
      {isPending && <p>loading...</p>}
      <div ref={loadMoreRef} className="h-5" />
    </div>
  );
}

export default UserPost;
