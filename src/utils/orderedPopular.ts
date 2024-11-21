import { PostType } from "@/types/home.type";

export const orderedPopular = (post: PostType[]) => {
  const result = post.sort((a, b) => {
    // repost 많은 순으로 정렬
    const repost = b.reposts.length - a.reposts.length;
    if (repost !== 0) return repost;
    // repost 수가 똑같으면 like 순으로 정렬
    const like = b.likes.length - a.likes.length;
    if (like !== 0) return like;
    // likes도 똑같으면 comment 순으로 정렬
    const comment = b.comments.length - a.comments.length;
    if (comment !== 0) return comment;
    // repost, like, comment가 똑같으면 최신순으로
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return result;
};
