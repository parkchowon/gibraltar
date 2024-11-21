type Repost = {
  post_id: string;
  reposted_at: string;
  reposted_by: string;
  is_quoted: boolean;
};

type Post = {
  id: string;
  created_at: string;
};

type PostsArrayType = {
  reposts: Repost[];
  posts: Post[];
};

// 타임라인 정렬된 데이터를 반환하는 함수
export const sortDataByTime = ({ reposts, posts }: PostsArrayType) => {
  const combinedPosts = [
    ...posts.map((post) => ({ ...post, type: "post" as const })), // post 타입 추가
    ...reposts.map((repost) => ({ ...repost, type: "repost" as const })), // repost 타입 추가
  ].sort((a, b) => {
    // a와 b의 시간 정보 가져오기
    const aTime = a.type === "post" ? a.created_at : a.reposted_at;
    const bTime = b.type === "post" ? b.created_at : b.reposted_at;

    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  const combinedPostId = combinedPosts
    .map((post) =>
      post.type === "post"
        ? {
            id: post.id,
            created_at: post.created_at,
          }
        : {
            id: post.post_id,
            created_at: post.reposted_at,
            isReposted: true,
            reposted_by: post.reposted_by,
          }
    )
    .slice(0, 10);

  return combinedPostId;
};

// 검색 인기순 post 정렬하는 함수
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
