import { fetchCommentInPost } from "@/apis/post.api";
import Post from "@/app/(provider)/(root)/home/_components/Post";
import { PostType } from "@/types/home.type";
import { useQuery } from "@tanstack/react-query";

function PostComments({ post }: { post: PostType }) {
  const { data: comments, isPending } = useQuery({
    queryKey: ["timelineData", post.id],
    queryFn: () => {
      if (post) {
        return fetchCommentInPost(post.id);
      }
    },
  });

  if (isPending) return <p>loading...</p>;

  return (
    <div>
      {comments &&
        comments.map((comment) => {
          return <Post key={comment.id} post={comment} />;
        })}
    </div>
  );
}

export default PostComments;
