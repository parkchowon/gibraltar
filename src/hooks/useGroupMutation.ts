import {
  createGroup,
  createParticipantGroup,
  deleteGroup,
} from "@/apis/group.api";
import { GroupCreateType, GroupStatusType } from "@/types/group.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useGroupCreateMutation = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (group: GroupCreateType) => createGroup(group),
    onMutate: async (newState) => {
      const prevGroupList = queryClient.getQueryData(["groupList"]);
      await queryClient.cancelQueries({ queryKey: ["groupList"] });
      if (prevGroupList) {
        queryClient.setQueryData(["groupList"], {
          ...prevGroupList,
          ...[newState],
        });
      }
      return () => queryClient.setQueryData(["groupList"], prevGroupList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupList"],
      });
    },
    onSuccess: options?.onSuccess,
  });
};

export const useGroupDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      deleteGroup(groupId, userId),
    onMutate: async (newState) => {
      const prevGroupList = queryClient.getQueryData(["groupList"]);
      await queryClient.cancelQueries({ queryKey: ["groupList"] });
      if (prevGroupList) {
        queryClient.setQueryData(["groupList"], {
          ...prevGroupList,
          ...[newState],
        });
      }
      return () => queryClient.setQueryData(["groupList"], prevGroupList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupList"],
      });
    },
  });
};

export const useParticipantCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      userId,
      position,
    }: {
      groupId: string;
      userId: string;
      position: string;
    }) => createParticipantGroup(groupId, userId, position),
    onMutate: async (newState) => {
      await queryClient.cancelQueries({ queryKey: ["groupStatus"] });
      const prevGroupList = queryClient.getQueryData<GroupStatusType>([
        "groupStatus",
      ]);
      if (prevGroupList) {
        queryClient.setQueryData(["groupStatus"], (old: GroupStatusType) => ({
          ...old!,
          status: "참가",
        }));
      }
      return () => queryClient.setQueryData(["groupStatus"], prevGroupList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupStatus"],
      });
    },
  });
};
