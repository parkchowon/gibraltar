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

export const createPost = async (
  post: CreatePostType,
  tags?: TagRow[],
  handles?: string[]
) => {
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

    if (post.quoted_post_id) {
      const response = await apiClient.post(
        `api/post/${post.quoted_post_id}/repost?user_id=${
          post.user_id
        }&is_quoted=${true}&repost_id=${data.data.postId}`
      );
    }

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

    /** tag된 유저에게 알림 가게 */
    if (handles && handles.length > 0) {
      const getUserIds = async () => {
        return await Promise.all(
          handles.map(async (handle) => {
            const response = await apiClient.get(
              `api/auth/user/handle/${handle}`
            );
            return response.data as string;
          })
        );
      };

      const userIds = await getUserIds();

      await Promise.all(
        userIds.map(async (userId) => {
          const { data: notiData } = await apiClient.post("/api/notification", {
            reacted_user_id: post.user_id,
            type: "comment",
            user_id: userId,
            mentioned_post_id: data.data.postId,
            related_post_id: null,
          });
        })
      );
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
    const response = await apiClient.delete(`/api/post/${postId}`, {
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
  repostId?: string,
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
export const fetchCommentInPost = async (
  postId: string
): Promise<PostsType> => {
  try {
    const response = await apiClient.get(`api/post/${postId}/comment/child`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchParentsPost = async (postId: string) => {
  try {
    const response = await apiClient.get(`api/post/${postId}/comment/parents`);
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

/** 인용알티 한 post 불러오는 함수 */
export const fetchQuotePost = async (postId: string) => {
  try {
    const response = await apiClient.get(`api/post/${postId}/quote`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const reportPost = async (
  postId: string,
  userId: string,
  reason: string
) => {
  try {
    const response = await apiClient.post(
      `api/post/user/${userId}/report?post_id=${postId}&reason=${reason}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
