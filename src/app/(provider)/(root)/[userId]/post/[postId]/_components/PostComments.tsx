import { fetchCommentInPost } from "@/apis/post.api";
import Post from "@/app/(provider)/(root)/home/_components/Post/Post";
import PostLoading from "@/components/Loading/PostLoading";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";

function PostComments({ postId }: { postId: string }) {
  const pathname = usePathname();
  const topPostId = pathname.split("/")[3];

  const [commentList, setCommentList] = useState<string[]>([]);

  const { data: comments, isPending } = useQuery({
    queryKey: ["timelineData", postId],
    queryFn: () => {
      if (postId) {
        return fetchCommentInPost(postId);
      }
    },
  });

  if (isPending) return <PostLoading />;

  // TODO: 타래가 3개 이상으로 많아지면 더보기 토글 버튼 눌러서 보게하기
  return (
    <div className="divide-y-[1px] divide-gray-400">
      {comments &&
        comments.map((comment, index) => {
          if (comment.comments && comment.comments.length) {
            return (
              <div key={comment.id} className="relative">
                <Post post={comment} />
                <div className="absolute left-[72px] top-20 h-10 w-[1px] bg-gray-400" />
                <PostComments postId={comment.id} />
              </div>
            );
          } else if (comment.parent_post_id === topPostId || index === 0) {
            return <Post key={comment.id} post={comment} />;
          }
        })}
    </div>
  );
}

export default PostComments;
