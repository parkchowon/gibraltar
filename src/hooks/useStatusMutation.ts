import { userStatusUpdate } from "@/apis/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStatusMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) => userStatusUpdate(userId, status),
    onMutate: async (newStatus: string) => {
      const prevUserData = queryClient.getQueryData(["userData"]);
      await queryClient.cancelQueries({ queryKey: ["userData"] });

      if (prevUserData) {
        queryClient.setQueryData(["userData"], {
          ...prevUserData,
          status: newStatus,
        });
      }
      return prevUserData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["userData"],
      });
    },
  });
};
