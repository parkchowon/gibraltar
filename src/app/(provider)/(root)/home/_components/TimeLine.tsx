"use client";

import { getPost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";

function TimeLine() {
  const { userData } = useAuth();

  const { isPending, data } = useQuery({
    queryKey: ["timelineData", userData],
    queryFn: () => {
      if (userData) {
        return getPost(userData.id);
      }
    },
    refetchInterval: 10000,
  });

  const posts = data?.slice(0).reverse();

  if (isPending) return <p>loading...</p>;

  return (
    <div className="flex flex-col h-fit pt-[77px] divide-y-2 divide-gray-300">
      {posts &&
        posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
    </div>
  );
}

export default TimeLine;
