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
    onMutate: async (newState) => {
      const prevProfileData = queryClient.getQueryData(["profileData"]);
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      const prevRecommendedUsers = queryClient.getQueryData([
        "recommendedUsers",
      ]);

      // overwrite 방지를 위해 취소시킴
      await queryClient.cancelQueries({ queryKey: ["profileData"] });
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      await queryClient.cancelQueries({ queryKey: ["recommendedUsers"] });

      // 미리 UI 적용
      if (prevProfileData) {
        queryClient.setQueryData(["profileData"], {
          ...prevProfileData,
          followerList: newState,
        });
      }
      if (prevTimeline) {
        queryClient.setQueryData(["timelineData"], {
          ...prevTimeline,
        });
      }
      if (prevRecommendedUsers) {
        queryClient.setQueryData(["recommendedUsers"], {
          ...prevRecommendedUsers,
          isFollowing: true,
        });
      }
      // 에러나면 이전 것을..
      return { prevProfileData, prevTimeline, prevRecommendedUsers };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recommendedUsers"],
      });
    },
  });

  const unFollowMutation = useMutation({
    mutationFn: ({ userId, followingId }: followMutateType) =>
      deleteFollow(userId, followingId),
    onMutate: async (newState) => {
      const prevProfileData = queryClient.getQueryData(["profileData"]);
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      const prevRecommendedUsers = queryClient.getQueryData([
        "recommendedUsers",
      ]);

      // overwrite 방지를 위해 취소시킴
      await queryClient.cancelQueries({ queryKey: ["profileData"] });
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      await queryClient.cancelQueries({ queryKey: ["recommendedUsers"] });

      // 미리 UI 적용
      if (prevProfileData) {
        queryClient.setQueryData(["profileData"], {
          ...prevProfileData,
          followerList: newState,
        });
      }
      if (prevTimeline) {
        queryClient.setQueryData(["timelineData"], {
          ...prevTimeline,
        });
      }
      if (prevRecommendedUsers) {
        queryClient.setQueryData(["recommendedUsers"], {
          ...prevRecommendedUsers,
          isFollowing: false,
        });
      }

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
      queryClient.invalidateQueries({
        queryKey: ["recommendedUsers"],
      });
    },
  });

  return { followMutation, unFollowMutation };
};
