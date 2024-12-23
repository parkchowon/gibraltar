import { profileDetailUpdate } from "@/apis/profile.api";
import { ProfileType, UserProfileType } from "@/types/profile.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProfileUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: ProfileType) => {
      return profileDetailUpdate(profile);
    },
    onMutate: async (newState) => {
      const prevProfile = queryClient.getQueryData(["profileData"]);
      const prevSideProfile = queryClient.getQueryData(["sideProfileData"]);

      await queryClient.cancelQueries({ queryKey: ["profileData"] });
      await queryClient.cancelQueries({ queryKey: ["sideProfileData"] });

      if (prevProfile) {
        queryClient.setQueryData(["profileData"], {
          ...prevProfile,
          profileUser: newState,
        });
      }

      if (prevSideProfile) {
        queryClient.setQueryData(["sideProfileData"], {
          ...prevSideProfile,
          newState,
        });
      }

      return () => {
        queryClient.setQueryData(["profileData"], prevProfile);
        queryClient.setQueryData(["sideProfileData"], prevSideProfile);
      };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
      });
      queryClient.invalidateQueries({ queryKey: ["sideProfileData"] });
    },
  });
};
