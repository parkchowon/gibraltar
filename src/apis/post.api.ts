import supabase from "@/supabase/client";
import { TagRow } from "@/types/database";
import {
  CreatePostType,
  LikesFnType,
  PostsType,
  PostType,
  RepostFnType,
} from "@/types/home.type";
import apiClient from "./apiClient.api";

export const createPost = async (post: CreatePostType, tags?: TagRow[]) => {
  let postMediaURLs = null;

  try {
    /** storage에 미디어 저장 */
    if (post.images && post.images.length > 0) {
      const formData = new FormData();
      post.images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("user_id", post.user_id);

      // 이미지 업로드 요청
      const uploadResponse = await apiClient.post(
        "/api/storage/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      postMediaURLs = uploadResponse.data.urls; // 서버에서 반환된 URL 배열
    }
    /** posts 테이블에 post 저장 */
    const data = await apiClient.post("/api/post", {
      content: post.content,
      images: postMediaURLs || null,
      user_id: post.user_id,
      parent_post_id: post.parent_post_id,
      quoted_post_id: post.quoted_post_id,
      tags: tags || [],
    });

    /** 다른 사람의 게시물에 인용, 멘션을 달았을 경우 알림 저장 */
    if (!!post.parent_user_id && post.user_id !== post.parent_user_id) {
      const type = post.quoted_post_id ? "quote" : "comment";

      const { data: notiData } = await apiClient.post("/api/notification", {
        reacted_user_id: post.user_id,
        type: type,
        user_id: post.parent_user_id,
        mentioned_post_id: data.data.postId,
        related_post_id: post.parent_post_id,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

/**  user가 팔로하고 있는 모든 유저의 게시글 불러오기 */
export const getPost = async (userId: string | null, cursor: string | null) => {
  try {
    const response = await apiClient.get<PostsType>(
      `api/post/following?user_id=${userId}&cursor=${cursor}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/** user의 포스팅과 리포스트 불러오기 */
export const getUserPost = async (userId: string, cursor: string | null) => {
  try {
    const response = await apiClient.get<PostsType>(
      `api/post/user/${userId}?cursor=${cursor}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// user의 media만 불러오기
export const getUserMedia = async (userId: string, page: number) => {
  try {
    const response = await apiClient.get<PostsType>(
      `api/post/user/${userId}/media?page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// user의 bookmark한 것 불러오기
export const getUserBookmark = async (userId: string, page: number) => {
  try {
    const response = await apiClient.get<PostsType>(
      `api/post/user/${userId}/like?page=${page}`
    );
    return response.data;
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
    const response = await apiClient.get(`/api/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 하나의 post 삭제하기
export const deletePost = async (postId: string, userId: string) => {
  try {
    await apiClient.delete(`/api/post/${postId}`, {
      params: { userId: userId },
    });
  } catch (error) {
    console.error(error);
    return alert("포스트 삭제중 오류 발생");
  }
};

// tag 리스트 불러오기
export const getTagList = async () => {
  try {
    const { data, error } = await supabase.from("tags").select("*");
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

/** repost 관련 실행, 취소 */
export const insertRepost = async (
  postId: string | null,
  userId: string | undefined,
  postUserId: string,
  is_quoted?: boolean
) => {
  try {
    const response = await apiClient.post(
      `api/post/${postId}/repost?user_id=${userId}&is_quoted=${is_quoted}`
    );

    if (response.status === 200 && !is_quoted) {
      // 인용은 post 생성 로직에서 알림 처리해서 인용이 아닌 repost만
      await apiClient.post("api/notification", {
        reacted_user_id: userId,
        type: "repost",
        user_id: postUserId,
        mentioned_post_id: null,
        related_post_id: postId,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteRepost = async ({
  postId,
  userId,
  postUserId,
}: RepostFnType) => {
  try {
    const response = await apiClient.delete(
      `api/post/${postId}/repost?user_id=${userId}`
    );

    if (response.status === 200) {
      await apiClient.delete(
        `api/notification?related_post_id=${postId}&reacted_user_id=${userId}&user_id=${postUserId}&type=repost`
      );
    }
  } catch (error) {
    console.error(error);
  }
};

/** like 관련 실행, 취소 */
export const clickLike = async ({
  postId,
  userId,
  state,
  postUserId,
}: LikesFnType) => {
  try {
    if (state) {
      //like 반응
      const response = await apiClient.post(
        `api/post/${postId}/like?user_id=${userId}`
      );
      if (response.status === 200) {
        await apiClient.post("api/notification", {
          reacted_user_id: userId,
          type: "like",
          user_id: postUserId,
          mentioned_post_id: null,
          related_post_id: postId,
        });
      }
    } else {
      // like 취소
      const response = await apiClient.delete(
        `api/post/${postId}/like?user_id=${userId}`
      );
      if (response.status === 200) {
        await apiClient.delete(
          `api/notification?related_post_id=${postId}&reacted_user_id=${userId}&user_id=${postUserId}&type=like`
        );
      }
    }
  } catch (error) {
    console.error(error);
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

export const deletedPost = async (postId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error(e);
  }
};
