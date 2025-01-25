import {
  clickLike,
  createPost,
  deletePost,
  deleteRepost,
  fetchPostDetail,
  insertRepost,
} from "@/apis/post.api";
import { TagRow } from "@/types/database";
import {
  CreatePostType,
  CreateQuoteType,
  deletePostType,
  LikesFnType,
  RepostFnType,
} from "@/types/home.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// post 리포스트 mutation
export const useRepostMutation = () => {
  const queryClient = useQueryClient();
  // repost 상태 낙관적 업데이트
  return useMutation({
    mutationFn: ({ postId, userId, postUserId }: RepostFnType) =>
      deleteRepost({ postId, userId, postUserId }),
    onMutate: async (newState) => {
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      // overwrite 방지를 위해 취소시킴
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      // 미리 UI 적용
      if (prevTimeline) {
        queryClient.setQueryData(["timelineData"], {
          ...prevTimeline,
          reposted_by: null,
          isReposted: false,
          reposts: newState,
        });
      }
      // 에러나면 이전 것을..
      return () => queryClient.setQueryData(["timelineData"], prevTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
  });
};

// post 좋아요 mutation
export const useLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId, state = true, postUserId }: LikesFnType) =>
      clickLike({ postId, userId, state, postUserId }),
    onMutate: async (newState) => {
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      if (prevTimeline) {
        queryClient.setQueryData(["timelineData"], {
          ...prevTimeline,
          likes: newState,
        });
      }
      return () => queryClient.setQueryData(["timelineData"], prevTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
  });
};

// comments useMutation
export const useCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ comment }: { comment: CreatePostType }) =>
      createPost(comment),
    onMutate: async (newState) => {
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      if (prevTimeline) {
        queryClient.setQueryData(["timelineData"], {
          ...prevTimeline,
          comments: newState,
        });
      }
      return () => queryClient.setQueryData(["timelineData"], prevTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
    onSuccess: () => {
      toast.success("댓글이 등록되었습니다.");
    },
    onError: () => {
      toast.error("댓글 등록 중 에러 발생. 다시 시도해주세요.");
    },
  });
};

export const useQuoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quote }: { quote: CreateQuoteType }) => {
      return createPost({
        content: quote.content,
        images: quote.images,
        parent_post_id: quote.parent_post_id,
        parent_user_id: quote.post_user_id,
        user_id: quote.user_id,
        quoted_post_id: quote.quoted_post_id,
      });
    },
    onMutate: async (newState) => {
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      if (prevTimeline) {
        queryClient.setQueryData(["timelineData"], {
          ...prevTimeline,
          newState,
        });
      }
      return () => queryClient.setQueryData(["timelineData"], prevTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
    onSuccess: () => {
      toast.success("인용이 등록되었습니다.");
    },
    onError: () => {
      toast.error("인용 등록 중 에러 발생. 다시 시도해주세요.");
    },
  });
};

export const usePostCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      post,
      tags,
      handles,
    }: {
      post: CreatePostType;
      tags?: TagRow[];
      handles?: string[];
    }) => createPost(post, tags, handles),
    onMutate: async (newState) => {
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      if (prevTimeline) {
        queryClient.setQueryData(["timelineData"], {
          ...prevTimeline,
          ...[newState],
        });
      }
      return () => queryClient.setQueryData(["timelineData"], prevTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
    onSuccess: () => {
      toast.success("게시글이 등록되었습니다.");
    },
    onError: () => {
      toast.error("게시글 등록 중 에러 발생. 다시 시도해주세요.");
    },
  });
};

export const usePostDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: deletePostType) =>
      deletePost(postId, userId),
    onMutate: async (newState) => {
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      if (prevTimeline) {
        queryClient.setQueryData(["timelineData"], {
          ...prevTimeline,
          ...[newState],
        });
      }
      return () => queryClient.setQueryData(["timelineData"], prevTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
    onSuccess: () => {
      toast.success("게시글이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("게시글 삭제 도중 에러가 발생하였습니다. 다시 시도해주세요.");
    },
  });
};

// post 세부 페이지 timeline에서 불러오기
export const usePostDetail = (postId: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostDetail(postId),
  });
};
