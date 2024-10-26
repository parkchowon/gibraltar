import { userStatusUpdate } from "@/apis/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStatusMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) => userStatusUpdate(userId, status),
    onMutate: async (newStatus: string) => {
      const prevUserData = queryClient.getQueryData(["userData"]);
      const prevProfileData = queryClient.getQueryData(["profileData"]);
      await queryClient.cancelQueries({ queryKey: ["userData"] });
      await queryClient.cancelQueries({ queryKey: ["profileData"] });

      if (prevUserData) {
        queryClient.setQueryData(["userData"], {
          ...prevUserData,
          status: newStatus,
        });
      }

      if (prevProfileData) {
        queryClient.setQueryData(["profileData"], {
          ...prevProfileData,
          status: newStatus,
        });
      }
      return { prevUserData, prevProfileData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["userData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
      });
    },
  });
};
