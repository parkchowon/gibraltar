type Repost = {
  post_id: string;
  reposted_at: string;
  reposted_by: string;
};

type Post = {
  id: string;
  created_at: string;
};

type PostsArrayType = {
  reposts: Repost[];
  posts: Post[];
};

// 정렬된 데이터를 반환하는 함수
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
