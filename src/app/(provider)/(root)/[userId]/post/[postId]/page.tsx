"use client";
import MainLayout from "@/components/Layout/MainLayout";
import { usePostDetail } from "@/hooks/usePostMutation";
import { usePathname } from "next/navigation";
import Post from "../../../home/_components/Post/Post";
import CommentInput from "./_components/CommentInput";
import PostComments from "./_components/PostComments";
import PostLoading from "@/components/Loading/PostLoading";
import BackArrowBtn from "@/components/BackArrowBtn";
import PostParents from "./_components/PostParents";
import { useEffect, useRef } from "react";

function DetailPostPage() {
  const pathname = usePathname();
  const postId = pathname.split("/")[3];
  const scrollRef = useRef<HTMLDivElement>(null);
  // useQuery 접근
  const { data: post, isPending } = usePostDetail(postId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [post, scrollRef.current]);

  if (isPending || !post) {
    return (
      <MainLayout>
        <BackArrowBtn />
        <PostLoading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* 헤더 */}
      <BackArrowBtn />
      <div className="h-screen pt-[72px]">
        {post.parent_post_id && (
          <div className="px-6">
            <PostParents postId={post.parent_post_id} />
          </div>
        )}
        <div ref={scrollRef} className="px-6 divide-y-[1px] divide-gray-400">
          {/* 포스트 내용 */}
          <Post post={post} />
          {/* 댓글 작성 창 */}
          <CommentInput postId={postId} />
          {/* 댓글 */}
          <PostComments postId={postId} />
        </div>
      </div>
      <div className="w-full h-screen"></div>
    </MainLayout>
  );
}

export default DetailPostPage;
