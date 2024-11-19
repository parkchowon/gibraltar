import {
  fetchPopularSearch,
  fetchRecentSearch,
  fetchUserSearch,
} from "@/apis/search.api";
import PostLoading from "@/components/Loading/PostLoading";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Post from "../../home/_components/Post/Post";
import { useAuth } from "@/contexts/auth.context";
import UserItem from "@/components/UserItem";

const TAB = [
  { name: "인기순", path: "popular" },
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

  const { data, isPending } = useQuery({
    queryKey: ["searchPost", `${tabName}${searchText}`],
    queryFn: () => {
      switch (tabName) {
        case "popular":
          return fetchPopularSearch(searchText, user?.id);
        case "recent":
          return fetchRecentSearch(searchText, user?.id);
        case "user":
          return fetchUserSearch(searchText, user?.id);
        default:
          fetchPopularSearch(searchText, user?.id);
      }
    },
  });

  const handleClickTab = (tab: string) => {
    const current = new URLSearchParams(Array.from(params.entries()));
    current.set("tab", tab);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${path}${query}`);
  };

  if (isPending) return <PostLoading />;

  return (
    <>
      <div className="flex justify-evenly border-y-[1px] border-gray-400">
        {TAB.map((tab) => {
          return (
            <button
              key={tab.name}
              className={`relative py-3 flex-grow text-xs font-bold ${
                tabName === tab.path
                  ? "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[40px] after:h-[1px] after:bg-black"
                  : null
              } hover:bg-gray-100`}
              onClick={() => handleClickTab(tab.path)}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col h-fit px-6 divide-y-2 divide-gray-300 bg-gray-200">
        {data?.map((post) => {
          if (tabName !== "user") {
            return <Post key={post.id} post={post} />;
          }
          return <UserItem key={post.id} />;
        })}
      </div>
    </>
  );
}

export default SearchTab;
