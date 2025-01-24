import { useAuth } from "@/contexts/auth.context";
import { useProfileUpdateMutation } from "@/hooks/userProfileMutation";
import { useProfileStore } from "@/stores/profile.store";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

function WarningModal({
  setState,
}: {
  setState: Dispatch<SetStateAction<boolean>>;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { bio, favoriteTeam, playChamps, playStyle } = useProfileStore();
  const mutation = useProfileUpdateMutation();

  const handleOutClick = async () => {
    if (user) {
      const profile = {
        userId: user.id,
        bio: bio,
        playStyle: playStyle,
        mainChamps: playChamps.MainChamps,
        playChamps: playChamps.selectedChamps,
        favoriteTeam: favoriteTeam,
      };
      await mutation.mutateAsync(profile);
      router.push("/home");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="flex flex-col w-96 h-fit px-10 py-10 bg-white rounded-2xl gap-2 items-center justify-center">
        <p className="text-2xl font-bold">정말 나가시겠어요?</p>
        <p className="text-base">
          - 작성한 내용을 기반으로 비슷한 성향의 유저를 추천해드려요!
          <br />- 지금 나가면 텅 빈 타임라인을 맞이하게 돼요.
        </p>
        <div className="flex mt-6 w-full justify-evenly">
          <button
            onClick={() => setState(false)}
            className="px-3 py-1 w-40 font-semibold bg-carrot rounded-full text-lg text-white"
          >
            윈니오
          </button>
          <button
            onClick={handleOutClick}
            className="px-3 py-1 w-24 bg-mainGray rounded-full text-lg text-white"
          >
            윈
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;
