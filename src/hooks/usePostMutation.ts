import { clickLike, deleteRepost, fetchPostDetail } from "@/apis/post.api";
import { LikesFnType, PostType } from "@/types/home.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// post 리포스트 mutation
export const useRepostMutation = (postId : string)=>{
  const queryClient = useQueryClient();
  // repost 상태 낙관적 업데이트
  return useMutation({
    mutationFn: () => deleteRepost(postId),
    onMutate: async () => {
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      // overwrite 방지를 위해 취소시킴
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      // 미리 UI 적용
      queryClient.setQueryData(["timelineData"], "");
      // 에러나면 이전 것을..
      return () => queryClient.setQueryData(["timelineData"], prevTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
  });
}

// post 좋아요 mutation
export const useLikeMutation = ()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({postId, userId, state = true}: LikesFnType) => clickLike({postId, userId, state}),
    onMutate: async () => {
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      queryClient.setQueryData(["timelineData"], "");
      return () => queryClient.setQueryData(["timelineData"], prevTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
  });
}

// post 세부 페이지 timeline에서 불러오기
export const usePostDetail = (postId: string) =>{
  const queryClient = useQueryClient()

  const initialData = queryClient.getQueryData<PostType[]>(['timelineData'])?.find(post=>post.id === postId);
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostDetail(postId),
    initialData: initialData,
  });
}
