import { fetchParentsPost } from "@/apis/post.api";
import Post from "@/app/(provider)/(root)/home/_components/Post/Post";
import PostLoading from "@/components/Loading/PostLoading";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function PostParents({ postId }: { postId: string }) {
  const { data: parents, isPending } = useQuery({
    queryKey: ["parentsPost", postId],
    queryFn: () => fetchParentsPost(postId),
  });

  if (isPending) return <PostLoading />;

  return (
    <>
      {parents &&
        (parents.parent_post_id ? (
          <div key={parents.id}>
            <PostParents postId={parents.parent_post_id} />
            <div className="relative">
              <Post post={parents} />
              <div className="absolute left-[6.5%] top-20 h-10 w-[1px] bg-gray-400" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <Post key={parents.id} post={parents} />
            <div className="absolute left-[6.5%] top-20 h-10 w-[1px] bg-gray-400" />
          </div>
        ))}
    </>
  );
}

export default PostParents;
