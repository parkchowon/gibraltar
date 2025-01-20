import { addFollow, deleteFollow } from "@/apis/follow.api";
import { PostsType } from "@/types/home.type";
import { FollowType, RecommendedUserType } from "@/types/profile.type";
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
      // overwrite 방지를 위해 취소시킴
      await queryClient.cancelQueries({ queryKey: ["profileData"] });
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      await queryClient.cancelQueries({ queryKey: ["recommendedUsers"] });
      await queryClient.cancelQueries({ queryKey: ["followCheck"] });

      // 이전 데이터를 저장장
      const prevProfileData = queryClient.getQueryData(["profileData"]);
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      const followCheck = queryClient.getQueryData(["followCheck"]);
      const prevRecommendedUsers = queryClient.getQueryData<
        RecommendedUserType | undefined
      >(["recommendedUsers"]);

      //       // 미리 UI 적용
      //       queryClient.setQueryData<{
      //     followerList: FollowType;
      //     profileUser: any;
      //     postCount: any;
      // } | undefined>(["profileData"], (old) => old ? ({
      //         ...old,
      //         followerList:{
      //           ...old,

      //         },
      //       }): undefined);

      queryClient.setQueryData<PostsType | undefined>(["timelineData"], (old) =>
        old
          ? {
              ...old,
              ...newState,
            }
          : undefined
      );
      queryClient.setQueryData<boolean>(["followCheck"], () => true);
      queryClient.setQueryData<RecommendedUserType | undefined>(
        ["recommendedUsers"],
        (old) =>
          old
            ? old.map((user) =>
                user.user.id === newState.followingId
                  ? { ...user, isFollowing: true }
                  : user
              )
            : undefined
      );
      // 에러나면 이전 것을..
      return {
        prevProfileData,
        prevTimeline,
        followCheck,
        prevRecommendedUsers,
      };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["followCheck"],
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
      // overwrite 방지를 위해 취소시킴
      await queryClient.cancelQueries({ queryKey: ["profileData"] });
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      await queryClient.cancelQueries({ queryKey: ["recommendedUsers"] });
      await queryClient.cancelQueries({ queryKey: ["followCheck"] });

      // 이전 데이터를 저장장
      const prevProfileData = queryClient.getQueryData(["profileData"]);
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      const followCheck = queryClient.getQueryData(["followCheck"]);
      const prevRecommendedUsers = queryClient.getQueryData<
        RecommendedUserType | undefined
      >(["recommendedUsers"]);

      //       // 미리 UI 적용
      //       queryClient.setQueryData<{
      //     followerList: FollowType;
      //     profileUser: any;
      //     postCount: any;
      // } | undefined>(["profileData"], (old) => old ? ({
      //         ...old,
      //         followerList:{
      //           ...old,

      //         },
      //       }): undefined);

      queryClient.setQueryData<PostsType | undefined>(["timelineData"], (old) =>
        old
          ? {
              ...old,
              ...newState,
            }
          : undefined
      );
      queryClient.setQueryData<boolean>(["followCheck"], () => true);
      queryClient.setQueryData<RecommendedUserType | undefined>(
        ["recommendedUsers"],
        (old) =>
          old
            ? old.map((user) =>
                user.user.id === newState.followingId
                  ? { ...user, isFollowing: false }
                  : user
              )
            : undefined
      );

      // 에러나면 이전 것을..
      return { prevProfileData, prevTimeline, followCheck };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["followCheck"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recommendedUsers"],
      });
    },
  });

  return { followMutation, unFollowMutation };
};
