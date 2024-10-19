import { addFollow, deleteFollow } from "@/apis/follow.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type followMutateType = {
  userId: string;
  followingId: string;
};

export const useFollow = () => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: ({ userId, followingId }: followMutateType) =>
      addFollow(userId, followingId),
    onMutate: async () => {
      const prevProfileData = queryClient.getQueryData(["profileData"]);
      const prevTimeline = queryClient.getQueryData(["timelineData"]);

      // overwrite 방지를 위해 취소시킴
      await queryClient.cancelQueries({ queryKey: ["profileData"] });
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });

      // 미리 UI 적용
      queryClient.setQueryData(["profileData"], "");
      queryClient.setQueryData(["timelineData"], "");
      // 에러나면 이전 것을..
      return { prevProfileData, prevTimeline };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
  });

  const unFollowMutation = useMutation({
    mutationFn: ({ userId, followingId }: followMutateType) =>
      deleteFollow(userId, followingId),
    onMutate: async () => {
      const prevProfileData = queryClient.getQueryData(["profileData"]);
      const prevTimeline = queryClient.getQueryData(["timelineData"]);

      // overwrite 방지를 위해 취소시킴
      await queryClient.cancelQueries({ queryKey: ["profileData"] });
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });

      // 미리 UI 적용
      queryClient.setQueryData(["profileData"], "");
      queryClient.setQueryData(["timelineData"], "");
      // 에러나면 이전 것을..
      return { prevProfileData, prevTimeline };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
  });

  return { followMutation, unFollowMutation };
};
