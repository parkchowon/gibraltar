"use client";
import MainLayout from "@/components/Layout/MainLayout";
import { usePostDetail } from "@/hooks/usePostMutation";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Post from "../../../home/_components/Post";
import CommentInput from "./_components/CommentInput";
import PostComments from "./_components/PostComments";

function DetailPostPage() {
  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/")[3];
  const { data: post } = usePostDetail(postId);

  const handleClickBack = () => {
    router.back();
  };

  if (!post) {
    return <p>loading...</p>;
  }

  return (
    <MainLayout>
      {/* 헤더 */}
      <div className="flex px-6 py-[26px] gap-8">
        <button onClick={handleClickBack}>
          <Image src={"/icons/arrow.svg"} alt="back" width={15} height={14} />
        </button>
        <p className="font-semibold">홈으로</p>
      </div>
      <div className="px-6 divide-y-[1px] divide-gray-400">
        {/* 포스트 내용 */}
        <Post post={post} />
        {/* 댓글 작성 창 */}
        <CommentInput postId={postId} />
        {/* 댓글 */}
        <PostComments postId={postId} />
      </div>
    </MainLayout>
  );
}

export default DetailPostPage;
