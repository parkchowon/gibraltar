import { userStatusUpdate } from "@/apis/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStatusMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) => userStatusUpdate(userId, status),
    onMutate: async (newStatus: string) => {
      const prevSideUserData = queryClient.getQueryData(["sideProfileData"]);
      const prevProfileData = queryClient.getQueryData(["profileData"]);

      await queryClient.cancelQueries({ queryKey: ["sideProfileData"] });
      await queryClient.cancelQueries({ queryKey: ["profileData"] });

      if (prevSideUserData) {
        queryClient.setQueryData(["sideProfileData"], {
          ...prevSideUserData,
          status: newStatus,
        });
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
