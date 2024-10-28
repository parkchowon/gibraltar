import supabase from "@/supabase/client";
import { TagRow } from "@/types/database";
import { CreatePostType, LikesFnType } from "@/types/home.type";

/** post를 생성하기 */
export const createPost = async (post: CreatePostType, tags?: TagRow[]) => {
  let postMediaURLs = null;

  try {
    // image가 있는 post일 시
    if (post.images && post.images.length > 0) {
      const filePaths = post.images.map((image) => {
        const type = image.type.startsWith("video/") ? "video" : "image";
        return `${post.user_id}/${type}/${Date.now()}_${image.name}`;
      });

      const uploadPromises = filePaths.map((filePath, idx) => {
        if (post.images)
          return supabase.storage
            .from("posts")
            .upload(filePath, post.images[idx]);
      });

      const uploadResults = await Promise.all(uploadPromises);

      const isSuccess = uploadResults.every(
        (result) => result && result.error === null
      );
      if (!isSuccess) {
        console.error("업로드 중에 에러가 생김");
      }

      postMediaURLs = filePaths.map((filePath) => {
        const { data } = supabase.storage.from("posts").getPublicUrl(filePath);
        return data.publicUrl;
      });
    }
  } catch (error) {
    // 오류, 실패 시 catch해서 끝냄.
    console.error("post image 저장중 오류:", error);
    throw error;
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      content: post.content,
      images: postMediaURLs || null,
      user_id: post.user_id,
      parent_post_id: post.parent_post_id,
    })
    .select()
    .single();
  if (error) {
    console.error("포스팅 저장 실패: ", error.message);
  }

  // tag가 있을 시,
  if (tags && data) {
    // post_tags에 들어갈 row
    const postTagTableRow = tags.map((tag) => ({
      post_id: data.id,
      tag_id: tag.id,
    }));
    // post_tags에도 저장
    const { data: tagData, error: tagError } = await supabase
      .from("post_tags")
      .insert(postTagTableRow);
    if (tagError) {
      console.error(tagError);
    }
    console.log("포스팅 저장 성공", tagData);
  }
};

/**  user가 팔로하고 있는 모든 유저의 게시글 불러오기 */

// 가져올 포스트 수
const POST_SIZE = 10;

// TODO: 팔로하고 있는 사람이 rt한 post까지 불러오기
// 근데 다른 유저가 같은 post를 rt했을 때..
export const getPost = async (userId: string, page: number) => {
  const start = (page - 1) * POST_SIZE;
  const end = page * POST_SIZE - 1;

  // 팔로우 하고 있는 사람들의 목록을 불러옴
  const { data: followings, error: followingError } = await supabase
    .from("followers")
    .select("following_id")
    .eq("follower_id", userId);
  const followingId = followings?.map((item) => item.following_id);
  const followerList = followingId ? [userId, ...followingId] : [userId];

  // 팔로하고 있는 사람들이 쓴 포스트를 start부터 end까지 불러옴
  const { data: posts, error: myError } = await supabase
    .from("posts")
    .select(
      "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name))"
    )
    .in("user_id", followerList)
    .is("parent_post_id", null)
    .range(start, end)
    .order("created_at", { ascending: false });
  const postsId = posts ? posts.map((item) => item.id) : [];

  const [repostsResult, likesResult, commentsResult] = await Promise.all([
    supabase
      .from("reposts")
      .select("post_id, comment, reposted_by, reposted_at")
      .in("post_id", postsId),
    supabase.from("likes").select("post_id, user_id").in("post_id", postsId),
    supabase.from("posts").select("*").in("parent_post_id", postsId),
  ]);
  const { data: reposts, error: reactsError } = repostsResult;
  const { data: likes, error: likesError } = likesResult;
  const { data: comments, error: commentError } = commentsResult;

  const enrichedPosts = posts?.map((post) => {
    const postReposts = reposts?.filter((repost) => repost.post_id === post.id);
    const postLikes = likes?.filter((like) => like.post_id === post.id);
    const postComments = comments?.filter(
      (comment) => comment.parent_post_id === post.id
    );

    return {
      ...post,
      reposts: postReposts,
      likes: postLikes,
      comments: postComments,
    };
  });

  if (myError) {
    console.error("로그인 유저의 포스팅 불러오는 중 에러: ", myError);
  }
  if (followingError) {
    console.error("팔로잉 목록 불러오는 중 에러:", followingError);
  }

  return enrichedPosts;
};

/** user의 포스팅만 불러오기 */
// TODO: 유저가 rt한 글도 불러오기
export const getUserPost = async (userId: string, page: number) => {
  const start = (page - 1) * POST_SIZE;
  const end = page * POST_SIZE - 1;

  const { data: repostPosts, error: repostError } = await supabase
    .from("reposts")
    .select("post_id")
    .eq("reposted_by", userId);
  const repostList = repostPosts?.map((repost) => repost.post_id) ?? [];

  const { data, error } = await supabase
    .from("posts")
    .select(
      "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_at), likes (post_id, user_id)"
    )
    .eq("user_id", userId)
    .is("parent_post_id", null)
    .range(start, end)
    .order("created_at", { ascending: false });

  const postsId = data ? data.map((item) => item.id) : [];

  const [repostsResult, likesResult, commentsResult] = await Promise.all([
    supabase
      .from("reposts")
      .select("post_id, comment, reposted_by, reposted_at")
      .in("post_id", postsId),
    supabase.from("likes").select("post_id, user_id").in("post_id", postsId),
    supabase.from("posts").select("*").in("parent_post_id", postsId),
  ]);
  const { data: reposts, error: reactsError } = repostsResult;
  const { data: likes, error: likesError } = likesResult;
  const { data: comments, error: commentError } = commentsResult;

  const enrichedPosts = data?.map((post) => {
    // const repostedPost = post.reposts.findIndex(
    //   (repost) => repost.reposted_by === userId
    // );
    // if (repostedPost > -1) {
    //   post.created_at = post.reposts[repostedPost].reposted_at;
    // }

    const postReposts = reposts?.filter((repost) => repost.post_id === post.id);
    const postLikes = likes?.filter((like) => like.post_id === post.id);
    const postComments = comments?.filter(
      (comment) => comment.parent_post_id === post.id
    );

    return {
      ...post,
      reposts: postReposts,
      likes: postLikes,
      comments: postComments,
    };
  });

  if (error) {
    console.error("post 불러오는 중 오류");
  }
  console.log(data);
  return enrichedPosts;
};

// user의 media만 불러오기
export const getUserMedia = async (userId: string, page: number) => {
  const start = (page - 1) * POST_SIZE;
  const end = page * POST_SIZE - 1;
  const { data, error } = await supabase
    .from("posts")
    .select(
      "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name))"
    )
    .eq("user_id", userId)
    .not("images", "is", null)
    .is("parent_post_id", null)
    .range(start, end)
    .order("created_at", { ascending: false });
  const postsId = data ? data.map((item) => item.id) : [];

  const [repostsResult, likesResult, commentsResult] = await Promise.all([
    supabase
      .from("reposts")
      .select("post_id, comment, reposted_by, reposted_at")
      .in("post_id", postsId),
    supabase.from("likes").select("post_id, user_id").in("post_id", postsId),
    supabase.from("posts").select("*").in("parent_post_id", postsId),
  ]);
  const { data: reposts, error: reactsError } = repostsResult;
  const { data: likes, error: likesError } = likesResult;
  const { data: comments, error: commentError } = commentsResult;

  const enrichedPosts = data?.map((post) => {
    const postReposts = reposts?.filter((repost) => repost.post_id === post.id);
    const postLikes = likes?.filter((like) => like.post_id === post.id);
    const postComments = comments?.filter(
      (comment) => comment.parent_post_id === post.id
    );

    return {
      ...post,
      reposts: postReposts,
      likes: postLikes,
      comments: postComments,
    };
  });

  if (error) {
    console.error("post 불러오는 중 오류");
  }
  return enrichedPosts;
};

// user의 bookmark한 것 불러오기
export const getUserBookmark = async (userId: string, page: number) => {
  const start = (page - 1) * POST_SIZE;
  const end = page * POST_SIZE - 1;

  const { data: likedPostsData, error: likedPostsError } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", userId);
  const likedPostsId = likedPostsData
    ? likedPostsData.map((post) => post.post_id)
    : [];

  const { data, error } = await supabase
    .from("posts")
    .select(
      "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name))"
    )
    .in("id", likedPostsId)
    .is("parent_post_id", null)
    .range(start, end)
    .order("created_at", { ascending: false });

  const postsId = data ? data.map((item) => item.id) : [];

  const [repostsResult, likesResult, commentsResult] = await Promise.all([
    supabase
      .from("reposts")
      .select("post_id, comment, reposted_by, reposted_at")
      .in("post_id", postsId),
    supabase.from("likes").select("post_id, user_id").in("post_id", postsId),
    supabase.from("posts").select("*").in("parent_post_id", postsId),
  ]);
  const { data: reposts, error: reactsError } = repostsResult;
  const { data: likes, error: likesError } = likesResult;
  const { data: comments, error: commentError } = commentsResult;

  const enrichedPosts = data?.map((post) => {
    const postReposts = reposts?.filter((repost) => repost.post_id === post.id);
    const postLikes = likes?.filter((like) => like.post_id === post.id);
    const postComments = comments?.filter(
      (comment) => comment.parent_post_id === post.id
    );

    return {
      ...post,
      reposts: postReposts,
      likes: postLikes,
      comments: postComments,
    };
  });

  if (error) {
    console.error("post 불러오는 중 오류");
  }
  return enrichedPosts;
};

// 클릭한 post 정보 하나 불러오기
export const fetchPostDetail = async (postId: string) => {
  const [postResult, repostsResult, likesResult, commentsResult] =
    await Promise.all([
      supabase
        .from("posts")
        .select(
          "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name))"
        )
        .eq("id", postId)
        .single(),
      supabase
        .from("reposts")
        .select("post_id, comment, reposted_by, reposted_at")
        .eq("post_id", postId),
      supabase.from("likes").select("post_id, user_id").eq("post_id", postId),
      supabase.from("posts").select("*").eq("parent_post_id", postId),
    ]);

  const { data, error } = postResult;
  const { data: reposts, error: reactsError } = repostsResult;
  const { data: likes, error: likesError } = likesResult;
  const { data: comments, error: commentError } = commentsResult;

  const post = Array.isArray(data) ? data[0] : data;

  return {
    ...post,
    reposts: reposts || undefined,
    likes: likes || undefined,
    comments: comments || undefined,
  };
};

// tag 리스트 불러오기
export const getTagList = async () => {
  const { data, error } = await supabase.from("tags").select("*");
  return data;
};

/** repost 관련 실행, 취소 */
export const insertRepost = async (
  postId: string,
  userId: string | undefined,
  comment?: string
) => {
  if (userId) {
    const { data, error } = await supabase
      .from("reposts")
      .insert({ post_id: postId, reposted_by: userId, comment: comment });
    if (error) {
      throw new Error(error.message);
    }
  }
};

export const deleteRepost = async (postId: string) => {
  const { data, error } = await supabase
    .from("reposts")
    .delete()
    .eq("post_id", postId);
  if (error) {
    throw new Error(error.message);
  }
  if (data) return data;
};

/** like 관련 실행, 취소 */
export const clickLike = async ({ postId, userId, state }: LikesFnType) => {
  if (state && userId) {
    const { data, error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId });
    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { data, error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId);
    if (error) {
      throw new Error(error.message);
    }
  }
};

/** comments 관련 함수 */
export const fetchCommentInPost = async (postId: string) => {
  //가장 상단에 있는 post에 대한 comment 리스트들
  const { data: comments, error } = await supabase
    .from("posts")
    .select("*, user:users (nickname, profile_url, handle)")
    .eq("parent_post_id", postId);
  const commentsId = comments ? comments.map((item) => item.id) : [];

  const [repostsResult, likesResult, childCommentsResult] = await Promise.all([
    supabase
      .from("reposts")
      .select("post_id, comment, reposted_by, reposted_at")
      .in("post_id", commentsId),
    supabase.from("likes").select("post_id, user_id").in("post_id", commentsId),
    supabase.from("posts").select("*").in("parent_post_id", commentsId),
  ]);

  const { data: reposts, error: reactsError } = repostsResult;
  const { data: likes, error: likesError } = likesResult;
  const { data: childComments, error: childCommentsError } =
    childCommentsResult;

  const enrichedComments = comments?.map((comment) => {
    const commentReposts = reposts?.filter(
      (repost) => repost.post_id === comment.id
    );
    const commentLikes = likes?.filter((like) => like.post_id === comment.id);
    const commentchildComments = childComments?.filter(
      (childComment) => childComment.parent_post_id === comment.id
    );

    return {
      ...comment,
      reposts: commentReposts,
      likes: commentLikes,
      comments: commentchildComments,
    };
  });

  return enrichedComments;
};
