import { createGroup, createParticipantGroup } from "@/apis/group.api";
import { GroupCreateType } from "@/types/group.type";
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

export const useParticipantCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      createParticipantGroup(groupId, userId),
    onMutate: async (newState) => {
      const prevGroupList = queryClient.getQueryData(["groupStatus"]);
      await queryClient.cancelQueries({ queryKey: ["groupStatus"] });
      if (prevGroupList) {
        queryClient.setQueryData(["groupStatus"], {
          ...prevGroupList,
          ...newState,
        });
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
