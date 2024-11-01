import supabase from "@/supabase/client";
import { TagRow } from "@/types/database";
import { CreatePostType, LikesFnType } from "@/types/home.type";
import { sortDataByTime } from "@/utils/sortDataByTime";

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

// TODO: 근데 다른 유저가 같은 post를 rt했을 때..
export const getPost = async (userId: string | null, cursor: string | null) => {
  try {
    if (!userId) throw new Error("로그인된 유저가 아님");

    // 팔로우 하고 있는 사람들의 목록을 불러옴
    const { data: followings, error: followingError } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", userId);

    if (followingError)
      throw new Error("팔로잉 목록 불러오는 중 에러:" + followingError.message);

    const followingId = followings?.map((item) => item.following_id);
    const followerList = followingId ? [userId, ...followingId] : [userId];

    const { data: nicknames, error: nicknameError } = await supabase
      .from("users")
      .select("id, nickname")
      .in("id", followingId);
    if (nicknameError) throw new Error(nicknameError.message);

    // 팔로하고 있는 사람들(본인 포함)이 rt한 postId 목록
    let repostsQuery = supabase
      .from("reposts")
      .select("post_id, reposted_at, reposted_by")
      .in("reposted_by", followerList)
      .order("reposted_at", { ascending: false })
      .limit(POST_SIZE);

    // 팔로하고 있는 사람(본임 포함)들의 포스팅
    let postsQuery = supabase
      .from("posts")
      .select("id, created_at")
      .in("user_id", followerList)
      .is("parent_post_id", null)
      .order("created_at", { ascending: false })
      .limit(POST_SIZE);

    // 첫번째면 최신순으로 위에서 10개, cursor가 있으면 거기서 부터 10개
    if (cursor) {
      postsQuery = postsQuery.lt("created_at", cursor);
      repostsQuery = repostsQuery.lt("reposted_at", cursor);
    }

    const [postsResult, repostsResult] = await Promise.all([
      postsQuery,
      repostsQuery,
    ]);

    // post와 repost 불러오는데 에러처리
    if (postsResult.error || repostsResult.error) {
      throw new Error("포스트와 리포스트 불러오는 중 에러");
    }

    // 시간순으로 정렬한 뒤 10개로 만든 배열
    const orderedPost = sortDataByTime({
      reposts: repostsResult.data || [],
      posts: postsResult.data || [],
    });

    // 최신순 post의 id값의 배열
    const orderedPostId = orderedPost.map((post) => post.id);

    // 최신순의 post와 repost id 배열
    const { data: posts, error: postError } = await supabase
      .from("posts")
      .select(
        "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by), likes (user_id)"
      )
      .in("id", orderedPostId)
      .is("parent_post_id", null)
      .order("created_at", { ascending: false });

    if (postError)
      throw new Error(
        "최신 타임라인 포스팅 불러오는 중 에러: " + postError.message
      );

    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", orderedPostId);

    if (commentError)
      throw new Error("댓글 갯수 불러오는 중 에러: " + commentError.message);

    const enrichedPosts = posts?.map((post) => {
      // post와 repost 순서를 맞추기 위해 reposted_at을 created_at으로 병합
      const repostedCheck = orderedPost.find((order) => order.id === post.id);
      let repostedUser = null;
      if (repostedCheck?.isReposted) {
        repostedUser =
          nicknames.find((nick) => nick.id === repostedCheck.reposted_by)
            ?.nickname || "";
      }

      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );

      return {
        ...post,
        isReposted: repostedCheck?.isReposted,
        reposted_by: repostedUser,
        comments: postComments,
      };
    });

    // TODO: post랑 repost 순서 로직 세우기 (지금은 그냥 post의 created_at 순으로되어있음)
    enrichedPosts?.sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    );

    return enrichedPosts || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

/** user의 포스팅과 리포스트 불러오기 */
export const getUserPost = async (userId: string, cursor: string | null) => {
  try {
    let repostsQuery = supabase
      .from("reposts")
      .select("post_id, reposted_at, reposted_by")
      .eq("reposted_by", userId)
      .order("reposted_at", { ascending: false })
      .limit(POST_SIZE);

    let postsQuery = supabase
      .from("posts")
      .select("id, created_at")
      .eq("user_id", userId)
      .is("parent_post_id", null)
      .order("created_at", { ascending: false })
      .limit(POST_SIZE);

    if (cursor) {
      postsQuery = postsQuery.lt("created_at", cursor);
      repostsQuery = repostsQuery.lt("reposted_at", cursor);
    }

    const [postsResult, repostsResult] = await Promise.all([
      postsQuery,
      repostsQuery,
    ]);

    if (postsResult.error || repostsResult.error) {
      throw new Error("post와 repost를 불러오는 도중 에러");
    }

    const orderedPost = sortDataByTime({
      reposts: repostsResult.data || [],
      posts: postsResult.data || [],
    });

    const orderedPostId = orderedPost.map((post) => post.id);

    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, reposted_at), likes (post_id, user_id)"
      )
      .in("id", orderedPostId);

    if (error) throw new Error(error.message);

    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", orderedPostId);
    if (commentError) throw new Error(commentError.message);

    const { data: userName, error: userError } = await supabase
      .from("users")
      .select("nickname")
      .eq("id", userId)
      .single();
    if (userError) throw new Error(userError.message);

    const enrichedPosts = data?.map((post) => {
      // TODO: post랑 repost 순서 로직 세우기
      const postCreatedAt = orderedPost.find((order) => order.id === post.id);
      post.created_at = postCreatedAt
        ? postCreatedAt.created_at
        : post.created_at;
      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );

      return {
        ...post,
        isReposted: postCreatedAt?.isReposted || false,
        reposted_by: userName.nickname || "",
        comments: postComments,
      };
    });

    enrichedPosts?.sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    );
    return enrichedPosts || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// user의 media만 불러오기
export const getUserMedia = async (userId: string, page: number) => {
  try {
    const start = (page - 1) * POST_SIZE;
    const end = page * POST_SIZE - 1;
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, reposted_at), likes (post_id, user_id)"
      )
      .eq("user_id", userId)
      .not("images", "is", null)
      .is("parent_post_id", null)
      .range(start, end)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const postsId = data ? data.map((item) => item.id) : [];

    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", postsId);
    if (commentError) throw new Error(commentError.message);

    const enrichedPosts = data?.map((post) => {
      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );

      return {
        ...post,
        isReposted: false,
        reposted_by: userId,
        comments: postComments,
      };
    });

    return enrichedPosts || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

// user의 bookmark한 것 불러오기
export const getUserBookmark = async (userId: string, page: number) => {
  try {
    const start = (page - 1) * POST_SIZE;
    const end = page * POST_SIZE - 1;

    const { data: likedPostsData, error: likedPostsError } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId);
    if (likedPostsError) throw new Error(likedPostsError.message);

    const likedPostsId = likedPostsData
      ? likedPostsData.map((post) => post.post_id)
      : [];

    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, reposted_at), likes (post_id, user_id)"
      )
      .in("id", likedPostsId)
      .is("parent_post_id", null)
      .range(start, end)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const postsId = data ? data.map((item) => item.id) : [];

    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", postsId);
    if (commentError) throw new Error(commentError.message);

    const enrichedPosts = data?.map((post) => {
      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );

      return {
        ...post,
        isReposted: false,
        reposted_by: userId,
        comments: postComments,
      };
    });

    return enrichedPosts || [];
  } catch (error) {
    console.log(error);
    return [];
  }
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
    .select(
      "*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, reposted_at), likes (post_id, user_id)"
    )
    .eq("parent_post_id", postId);

  const commentsId = comments ? comments.map((item) => item.id) : [];

  const { data: childComments, error: childCommentsError } = await supabase
    .from("posts")
    .select("*")
    .in("parent_post_id", commentsId);

  const enrichedComments = comments?.map((comment) => {
    const commentchildComments = childComments?.filter(
      (childComment) => childComment.parent_post_id === comment.id
    );

    return {
      ...comment,
      isReposted: false,
      reposted_by: null,
      comments: commentchildComments || [],
    };
  });

  return enrichedComments || [];
};
