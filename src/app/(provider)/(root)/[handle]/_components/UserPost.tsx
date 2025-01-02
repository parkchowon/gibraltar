import Post from "../../home/_components/Post/Post";
import { useEffect, useRef } from "react";
import { getUserPost } from "@/apis/post.api";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostLoading from "@/components/Loading/PostLoading";
import EmptyState from "@/components/EmptyState";

function UserPost({ userId }: { userId: string }) {
  const loadMoreRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["userPost", userId],
      queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
        getUserPost(userId, pageParam),
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.length === 0) {
          return undefined;
        }
        const lastPost = lastPage[lastPage.length - 1];
        const lastTime = lastPost.created_at;
        return lastTime;
      },
      refetchInterval: 10000,
      initialPageParam: null,
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
      {isPending ? (
        <PostLoading />
      ) : !data || data.pages.flatMap((page) => page).length === 0 ? (
        <EmptyState type="포스트" />
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
      {isFetchingNextPage && <PostLoading />}
    </div>
  );
}

export default UserPost;
