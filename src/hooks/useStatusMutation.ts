import { userStatusUpdate } from "@/apis/auth.api";
import { SideProfileType } from "@/types/status.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStatusMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) => userStatusUpdate(userId, status),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["sideProfileData"] });
      await queryClient.cancelQueries({ queryKey: ["profileData"] });

      const prevSideUserData = queryClient.getQueryData(["sideProfileData"]);
      const prevProfileData = queryClient.getQueryData(["profileData"]);

      if (prevSideUserData) {
        queryClient.setQueryData<SideProfileType>(["sideProfileData"], (old) =>
          old
            ? {
                ...old,
                status: newStatus,
              }
            : undefined
        );
      }

      if (prevProfileData) {
        queryClient.setQueryData(["profileData"], {
          ...prevProfileData,
          status: newStatus,
        });
      }
      return { prevSideUserData, prevProfileData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sideProfileData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
      });
    },
  });
};
