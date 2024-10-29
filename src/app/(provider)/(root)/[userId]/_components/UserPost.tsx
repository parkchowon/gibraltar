import Post from "../../home/_components/Post/Post";
import { useEffect, useRef } from "react";
import { getUserPost } from "@/apis/post.api";
import { useInfiniteQuery } from "@tanstack/react-query";

function UserPost({ userId }: { userId: string; }) {
  const loadMoreRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isPending } =
    useInfiniteQuery({
      queryKey: ["userPost", userId],
      queryFn: ({ pageParam = null }: {pageParam: string| null}) => getUserPost(userId, pageParam),
      getNextPageParam: (lastPage) => {
        if(!lastPage){
          return undefined;
        }
        const lastPost = lastPage[lastPage.length-1];
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
        <p>loading...</p>
      ) : data && data.pages.length === 0 ? (
        <p>아직 포스트가 없어요</p>
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
