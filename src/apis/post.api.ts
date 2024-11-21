import supabase from "@/supabase/client";
import { TagRow } from "@/types/database";
import {
  CreatePostType,
  LikesFnType,
  PostType,
  RepostFnType,
} from "@/types/home.type";
import { sortDataByTime } from "@/utils/sortData";

/** post를 생성하기 */
export const createPost = async (post: CreatePostType, tags?: TagRow[]) => {
  let postMediaURLs = null;

  /** storage에 미디어 저장 */
  try {
    // image가 있는 post일 시에만 storage에 저장
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
        throw new Error("storage에 미디어 저장 중 오류");
      }

      postMediaURLs = filePaths.map((filePath) => {
        const { data } = supabase.storage.from("posts").getPublicUrl(filePath);
        return data.publicUrl;
      });
    }
  } catch (error) {
    console.error("post image 저장중 오류:", error);
  }

  /** supabase table에 저장하는 로직 */
  try {
    // posts 테이블에 post 저장
    const { data, error } = await supabase
      .from("posts")
      .insert({
        content: post.content,
        images: postMediaURLs || null,
        user_id: post.user_id,
        parent_post_id: post.parent_post_id,
        quoted_post_id: post.quoted_post_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // tag가 있을 시 post_tags 테이블에 tag들 저장
    if (tags && data) {
      const postTagTableRow = tags.map((tag) => ({
        post_id: data.id,
        tag_id: tag.id,
      }));

      const { data: tagData, error: tagError } = await supabase
        .from("post_tags")
        .insert(postTagTableRow);
      if (tagError) {
        throw new Error(tagError.message);
      }
    }

    // quote 일시
    if (post.quoted_post_id) {
      // post의 user id를 받아옴
      const { data: postUser, error: postUserError } = await supabase
        .from("posts")
        .select("users (id)")
        .eq("id", post.quoted_post_id)
        .single();
      if (postUserError) {
        throw new Error(postUserError.message);
      }

      if (postUser && postUser.users) {
        const { data: notiData, error: notiError } = await supabase
          .from("notifications")
          .insert({
            reacted_user_id: post.user_id,
            type: "quote",
            user_id: postUser.users?.id,
            is_read: false,
            mentioned_post_id: data.id,
            related_post_id: post.parent_post_id,
          });
        if (notiError) throw new Error(notiError.message);
      }
    }

    // comment일시 notifications 테이블에 저장
    if (post.parent_post_id) {
      // post의 user id를 받아옴
      const { data: postUser, error: postUserError } = await supabase
        .from("posts")
        .select("users (id)")
        .eq("id", post.parent_post_id)
        .single();
      if (postUserError) {
        throw new Error(postUserError.message);
      }

      // post의 user id가 있을 시에 notifications에 저장
      if (postUser && postUser.users) {
        const { data: notiData, error: notiError } = await supabase
          .from("notifications")
          .insert({
            reacted_user_id: post.user_id,
            type: "comment",
            user_id: postUser?.users?.id,
            is_read: false,
            mentioned_post_id: data.id,
            related_post_id: post.parent_post_id,
          });
        if (notiError) {
          throw new Error(notiError.message);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

/**  user가 팔로하고 있는 모든 유저의 게시글 불러오기 */

// 가져올 포스트 수
const POST_SIZE = 10;

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
      .select("post_id, reposted_at, reposted_by, is_quoted")
      .in("reposted_by", followerList)
      .eq("is_quoted", false)
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
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
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
      const repostedCheck = orderedPost.find((order) => order.id === post.id);
      let repostedUser = null;
      let repostedTime = post.created_at;
      if (repostedCheck?.isReposted) {
        repostedUser =
          nicknames.find((nick) => nick.id === repostedCheck.reposted_by)
            ?.nickname || userId;
        repostedTime = repostedCheck.created_at;
      }

      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );

      return {
        ...post,
        isReposted: repostedCheck ? repostedCheck.isReposted : false,
        reposted_by: repostedUser,
        timeline_at: repostedTime,
        comments: postComments,
      };
    });

    enrichedPosts?.sort(
      (a, b) => Date.parse(b.timeline_at) - Date.parse(a.timeline_at)
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
      .select("post_id, reposted_at, reposted_by, is_quoted")
      .eq("reposted_by", userId)
      .eq("is_quoted", false)
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
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (post_id, user_id)"
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
        reposted_by: userName.nickname,
        timeline_at: post.created_at,
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
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (post_id, user_id)"
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
        timeline_at: post.created_at,
        comments: postComments,
      };
    });

    return enrichedPosts || [];
  } catch (error) {
    console.error(error);
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
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (post_id, user_id)"
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
        timeline_at: post.created_at,
        comments: postComments,
      };
    });

    return enrichedPosts || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 클릭한 post 정보 하나 불러오기
export const fetchPostDetail = async (
  postId: string
): Promise<PostType | undefined> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
      )
      .eq("id", postId)
      .single();

    if (error) throw new Error(error.message);

    const { data: commentData, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .eq("parent_post_id", postId);

    if (commentError) throw new Error(commentError.message);

    const result = {
      ...data,
      isReposted: false,
      reposted_by: "",
      timeline_at: data ? data.created_at : "",
      comments: commentData || [],
    };

    return result;
  } catch (error) {
    console.error(error);
  }
};

// tag 리스트 불러오기
export const getTagList = async () => {
  const { data, error } = await supabase.from("tags").select("*");
  return data;
};

/** repost 관련 실행, 취소 */
export const insertRepost = async (
  postId: string | null,
  userId: string | undefined,
  postUserId: string,
  is_quoted?: boolean
) => {
  if (userId && postId) {
    const { data, error } = await supabase
      .from("reposts")
      .insert({ post_id: postId, reposted_by: userId, is_quoted: is_quoted });

    if (is_quoted) return;
    const { data: notiData, error: notiError } = await supabase
      .from("notifications")
      .insert({
        reacted_user_id: userId,
        type: "repost",
        related_post_id: postId,
        user_id: postUserId,
        is_read: false,
      });

    if (error || notiError) {
      throw new Error(error?.message || notiError?.message);
    }
  }
};

export const deleteRepost = async ({
  postId,
  userId,
  postUserId,
}: RepostFnType) => {
  if (userId) {
    const { data, error } = await supabase
      .from("reposts")
      .delete()
      .eq("post_id", postId);

    const { data: notiData, error: notiError } = await supabase
      .from("notifications")
      .delete()
      .eq("related_post_id", postId)
      .eq("reacted_user_id", userId)
      .eq("user_id", postUserId)
      .eq("type", "repost");

    if (error) {
      throw new Error(error.message);
    }
  }
};

/** like 관련 실행, 취소 */
export const clickLike = async ({
  postId,
  userId,
  state,
  postUserId,
}: LikesFnType) => {
  if (!!userId == false) return;

  if (userId && state) {
    const { data, error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId });

    const { data: notiData, error: notiError } = await supabase
      .from("notifications")
      .insert({
        reacted_user_id: userId,
        type: "like",
        related_post_id: postId,
        user_id: postUserId,
        is_read: false,
      });

    if (error || notiError) {
      throw new Error(error?.message || notiError?.message);
    }
  } else if (userId && state == false) {
    const { data, error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId);

    const { data: notiData, error: notiError } = await supabase
      .from("notifications")
      .delete()
      .eq("related_post_id", postId)
      .eq("reacted_user_id", userId)
      .eq("user_id", postUserId)
      .eq("type", "like");

    if (error || notiError) {
      throw new Error(error?.message || notiError?.message);
    }
  }
};

/** comments 관련 함수 */
export const fetchCommentInPost = async (postId: string) => {
  //가장 상단에 있는 post에 대한 comment 리스트들
  const { data: comments, error } = await supabase
    .from("posts")
    .select(
      "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (post_id, user_id)"
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
      timeline_at: comment.created_at,
      comments: commentchildComments || [],
    };
  });

  return enrichedComments || [];
};

export const fetchParentsPost = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (post_id, user_id)"
      )
      .eq("id", postId)
      .single();

    if (error) throw new Error(error.message);

    const { data: commentData, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .eq("parent_post_id", postId);

    if (commentError) throw new Error(commentError.message);

    const result = {
      ...data,
      isReposted: false,
      reposted_by: "",
      timeline_at: data ? data.created_at : "",
      comments: commentData || [],
    };

    return result;
  } catch (e) {
    console.error(e);
    return;
  }
};

/** 인용알티 한 post 불러오는 함수 */
export const fetchQuotePost = async (postId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      "user: users (id, nickname, handle, profile_url), content, images, created_at"
    )
    .eq("id", postId)
    .single();
  if (error) return null;
  return data;
};
