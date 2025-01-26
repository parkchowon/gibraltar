import {
  createGroup,
  createParticipantGroup,
  deleteGroup,
} from "@/apis/group.api";
import { GroupCreateType, GroupStatusType } from "@/types/group.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
    onSuccess: () => {
      toast.success("그룹이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("그룹 삭제 중 에러 발생. 다시 시도해주세요.");
    },
  });
};

export const useParticipantCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      userId,
      groupOwnerId,
      position,
    }: {
      groupId: string;
      userId: string;
      groupOwnerId: string;
      position: string;
    }) => createParticipantGroup(groupId, userId, groupOwnerId, position),
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
    onSuccess: () => {
      toast.success("그룹에 참가신청을 완료했습니다.");
    },
    onError: () => {
      toast.error("그룹 참가 중 에러 발생. 다시 시도해주세요.");
    },
  });
};
