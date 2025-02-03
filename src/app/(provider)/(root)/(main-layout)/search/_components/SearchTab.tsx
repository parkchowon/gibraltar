import {
  fetchPopularSearch,
  fetchRecentSearch,
  fetchUserSearch,
} from "@/apis/search.api";
import PostLoading from "@/components/Loading/PostLoading";
import { useInfiniteQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth.context";
import UserItem from "@/components/UserItem";
import { SearchPostType, SearchUserType } from "@/types/search.type";
import EmptyState from "@/components/EmptyState";
import Post from "../../home/_components/Post/Post";

const TAB = [
  // { name: "인기순", path: "popular" },
  { name: "최신순", path: "recent" },
  { name: "사용자", path: "user" },
];

function SearchTab() {
  const { user } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const params = useSearchParams();
  const tabName = params.get("tab") ?? "";
  const searchText = params.get("word") ?? "";

  const loadMoreRef = useRef(null);

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["searchPost", `${tabName}${searchText}`],
      queryFn: ({
        pageParam = 1,
      }): Promise<SearchPostType | SearchUserType> => {
        if (user) {
          switch (tabName) {
            // case "popular":
            //   return fetchPopularSearch(searchText, user.id, pageParam);
            case "recent":
              return fetchRecentSearch(searchText, user.id, pageParam);
            case "user":
              return fetchUserSearch(searchText, pageParam);
            default:
              throw new Error(`Invalid tab name: ${tabName}`);
          }
        } else {
          throw new Error("there is no user return to home");
        }
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length === 0) return undefined;

        return allPages.length + 1;
      },
      initialPageParam: 1,
      enabled: !!user?.id,
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

  const handleClickTab = (tab: string) => {
    const current = new URLSearchParams(Array.from(params.entries()));
    current.set("tab", tab);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${path}${query}`);
  };

  return (
    <>
      <div className="flex justify-evenly border-b-[1px] border-mainGray">
        {TAB.map((tab) => {
          return (
            <button
              key={tab.name}
              className={`relative py-3 flex-grow text-xs font-bold ${
                tabName === tab.path
                  ? "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[40px] after:h-[1px] after:bg-black"
                  : null
              } hover:bg-subGray`}
              onClick={() => handleClickTab(tab.path)}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
      <div
        className={`flex flex-col h-fit divide-y-[1px] divide-mainGray bg-white`}
      >
        {isPending ? (
          <PostLoading />
        ) : data && data.pages.flatMap((page) => page.length).length === 1 ? (
          <EmptyState type="검색 결과" />
        ) : (
          data &&
          (tabName === "user"
            ? data.pages.map((page) => {
                return (page as SearchUserType).map((user) => {
                  return <UserItem key={user.id} user={user} />;
                });
              })
            : data.pages.map((page) => {
                return (page as SearchPostType).map((post) => {
                  return <Post key={post.id} post={post} />;
                });
              }))
        )}
        <div ref={loadMoreRef} style={{ height: "20px" }} />
        {isFetchingNextPage && <PostLoading />}
      </div>
    </>
  );
}

export default SearchTab;
