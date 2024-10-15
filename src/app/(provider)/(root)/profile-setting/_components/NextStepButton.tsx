"use client";
import { useProfileStore } from "@/stores/profile.store";
import { useRouter, useSearchParams } from "next/navigation";

type ButtonProps = {
  text?: string;
  isClickable?: boolean;
  onClick: () => void;
};
function NextStepButton({
  text = "다음단계로",
  isClickable = true,
  onClick,
}: ButtonProps) {
  const router = useRouter();
  const params = useSearchParams();
  const step = params.get("step");
  const { bio, favoriteTeam, playChamps, playStyle } = useProfileStore();

  const handleClickNext = () => {
    onClick();
    if (Number(step) < 5) {
      router.push(`/profile-setting?step=${Number(step) + 1}`);
    } else if (step === "5") {
      // TODO supabase에 유저 취향 저장하기
    } else {
      router.push("/home");
    }
  };

  return (
    <button
      onClick={handleClickNext}
      disabled={!isClickable}
      className={`w-[352px] ${
        isClickable ? "bg-mint" : "bg-gray-300 cursor-not-allowed"
      } rounded-full py-[19px] font-medium text-xl text-[#6A6A6A]`}
    >
      {text}
    </button>
  );
}

export default NextStepButton;
